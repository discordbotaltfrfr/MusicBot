require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');

// 1. Initialize the Discord Client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 2. Initialize the Player
const player = new Player(client);

// Load default extractors (YouTube, Spotify, SoundCloud, etc.)
player.extractors.loadMulti(DefaultExtractors);

// Log when the bot is ready
client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}!`);
    console.log('Ready to play some music.');
});

// 3. Command Handling
client.on('messageCreate', async (message) => {
    // Ignore bots and messages that don't start with our prefix "!"
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // !play command
    if (command === 'play') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('❌ You need to join a voice channel first!');

        const query = args.join(' ');
        if (!query) return message.reply('❌ Please provide a song name or YouTube link! (e.g., `!play Never Gonna Give You Up`)');

        // Let the user know we are searching
        const reply = await message.reply(`🔍 Searching for **${query}**...`);

        try {
            // Play the track
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: message // Attach the message object to the queue for later use
                }
            });

            await reply.edit(`🎶 Added to queue: **${track.title}**`);
        } catch (e) {
            console.error(e);
            await reply.edit(`❌ Something went wrong: ${e.message}`);
        }
    }

    // !skip command
    if (command === 'skip') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No music is currently playing!');
        
        queue.node.skip();
        message.reply('⏭️ Skipped the current track!');
    }

    // !stop command
    if (command === 'stop') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No music is currently playing!');
        
        queue.delete();
        message.reply('🛑 Stopped the music and cleared the queue.');
    }
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
