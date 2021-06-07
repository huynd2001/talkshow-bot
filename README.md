# TalkShow Widget

### **WARNING: This project is still under development.**

This widget was for display the discord chat onto OBS, developed in TypeScript.

This was made out of spite for the current StreamKit implementation from 
team Discord with their `[Object object]`.

## How to start the project

Make sure to install `npm` on the machine. Link to install can be see
on Google.

### discord-service-backend

This is the code for the backend to handling receiving messages.
Set up a `.env` file in the project, in it put down.
```text
TOKEN=[your bot token here]
```
Where `[yout bot token here]` stands for your bot's token.

`npm install` to install all necessary dependencies, then `npm start` 
to run.

This will open a WebSocket Server at `ws://localhost:8000`.

### talkshow-widget

This is the code for the display coded in Angular. Install packages with `npm install`, then `npm start`.

### How to use during streaming

Use as a browser source, at `https://localhost:4200/discord-chat`. The size of the widget is 400px width and 600px 
height.

### Support

...