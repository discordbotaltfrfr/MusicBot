Discord Music Bot Setup Guide

1. Local Setup

Create a new folder on your computer and put all 3 files (package.json, index.js, nixpacks.toml) into it.

Open your terminal in this folder and run: npm install

Go to the Discord Developer Portal.

Click "New Application" -> Name your bot.

Go to the Bot tab -> Click "Reset Token" and copy your Token.

Scroll down to Privileged Gateway Intents and turn ON Message Content Intent.

Create a file named .env in your project folder and add your token:
DISCORD_TOKEN=your_token_here

Test it locally by running: npm start

2. Pushing to GitHub

Create a new repository on GitHub.

Push your code to the repository (do NOT push your .env file! Always keep your token secret).

3. Deploying to Railway

Go to Railway.app and log in.

Click New Project -> Deploy from GitHub repo.

Select your bot's repository.

Once it initializes, click on your new service, go to the Variables tab.

Add a new variable:

Variable Name: DISCORD_TOKEN

Value: [Paste your bot token here]

Railway will automatically detect the nixpacks.toml file, install FFmpeg, and start your bot!
