# P2Bot - Product Packaging Bot
> POC: Create a slack app for product packaging UI

## Overview

This is a Slack app created for [Product Packaging UI][1] that showcases
responding to input values.

## Running locally

### 0. Create a new Slack App

- Go to https://api.slack.com/apps
- Click **Create App**
- Choose a workspace
- Enter App Manifest using contents of `manifest.yaml`
- Click **Create**

Once the app is created click **Install to Workspace** 
Then scroll down in Basic Info and click **Generate Token and Scopes** with both scopes
In Slash Command, click **Create New Command** with command **/p2bot**, short description **Product Packaging Bot**, and click **save**

### 1. Setup environment variables

```zsh
# Replace with your bot and app token
export SLACK_BOT_TOKEN=<your-bot-token> # from the OAuth section
export SLACK_APP_TOKEN=<your-app-level-token> # from the Basic Info App Token Section
```

### 2. Setup your local project

```zsh
# Clone this project onto your machine
git clone 

# Change into the project
cd slack-p2bot/

# Install the dependencies
npm install
```

### 3. Start servers
```zsh
make
```

### 4. Test

Go to the installed workspace and type /p2bot in a DM to your new bot. You can select input in the modal window and clicked submit. 



See you there and thanks for helping to improve Bolt for everyone!

[1]: https://console.splunkcloud.systems/lve/package/stack
