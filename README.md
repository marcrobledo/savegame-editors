# Unexplored Area Viewer for The Legend of Zelda: BOTW

### Because there _really_ needed to be 900 of them, right?

I was sitting around 600 Koroks found and was having a really difficult time following any sort of checklist to find the rest since I would need to check off all 600 that I found before it would be useful for me.

So, I slapped this together to parse a Cemu save file to show only the Koroks and Locations that I have yet to find. As you find them in-game, the map automatically refreshes to reflect your progress.

The toolbar tracks your running totals for:
- **Korok seeds** (out of 900)
- **Locations** (out of 226)
- **Shrines** (out of 120)
- **Towers** (out of 15)

A server status indicator and save file timestamp in the toolbar let you know the server is reachable and when your save was last read.

Thank you @marcrobledo for the [save game editors](https://github.com/marcrobledo/savegame-editors) much of this code is based off of and @MrCheeze for their [waypoint map](https://github.com/MrCheeze/botw-waypoint-map) which I modified to get the map markers I needed as well as all of their [datamining research](https://github.com/MrCheeze/botw-tools).

## Docker Setup

This application runs as a Docker container that automatically reads your Cemu save file and monitors it for changes, refreshing the map whenever you save in-game.

### Requirements

- Docker and Docker Compose running on the same machine as your Cemu save file (or with network access to it)

### Setup

1. Create a `server/.env` file to configure your Cemu save file path.

   **If running Docker from WSL (Linux-style path):**
   ```
   SAVE_PATH=/mnt/c/Users/YourWindowsUsername/AppData/Roaming/Cemu/mlc01/usr/save/00050000/101c9400/user/80000001/0
   ```

   **If running Docker from Windows (Command Prompt or PowerShell):**
   ```
   SAVE_PATH=C:/Users/YourWindowsUsername/AppData/Roaming/Cemu/mlc01/usr/save/00050000/101c9400/user/80000001/0
   ```

   Replace `YourWindowsUsername` with your Windows username. The save folder ID (`80000001`) may also differ — check your Cemu save directory if unsure.

2. Build and start the container:
   ```bash
   cd server
   docker compose up -d --build
   ```

3. Open the viewer in your browser:
   - From the same machine: http://localhost:3000
   - From another device on your network: `http://<docker-host-ip>:3000` (e.g. `http://192.168.1.100:3000`)

### How It Works

- The server reads your Cemu save file from the path defined in `server/.env`
- The save file is monitored for changes every 10 seconds
- When the save file is updated after playing, the page automatically refreshes to show your latest progress
