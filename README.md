# Unexplored Area Viewer for The Legend of Zelda: BOTW

### Because there _really_ needed to be 900 of them, right?

I was sitting around 600 Koroks found and was having a really difficult time following any sort of checklist to find the rest since I would need to check off all 600 that I found before it would be useful for me.

So, I slapped this together to parse a save file from the game to show only the ones that I have yet to find. I also added Locations on there for good measure as they play into the percentage on the map as well.

As you find Koroks/Locations, clicking on them will remove them from the map.

Once a save file has been loaded, the parsed data is saved into your web browser, so you can close the window whenever you like without losing anything. It will also remember any markers that you have removed.

If you would rather use this as a checklist _without_ loading a save file, that option is available as well.

Thank you @marcrobledo for the [save game editors](https://github.com/marcrobledo/savegame-editors) much of this code is based off of and @MrCheeze for the their [waypoint map](https://github.com/MrCheeze/botw-waypoint-map) which I modified to get the map markers I needed as well as all of their [datamining research](https://github.com/MrCheeze/botw-tools).

## Docker Setup (Server Mode)

This application can run as a Docker container that automatically loads the game save file and monitors for changes.

### Requirements

- Docker
- Docker Compose

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
   docker compose up -d
   ```

3. Open http://localhost:3000 in your browser.

### How It Works

- The server automatically loads the game save file from the mounted data directory
- The save file is monitored for changes every 10 seconds
- When the save file is updated (e.g., after playing the game), the page automatically refreshes to show updated data
- No manual drag-and-drop or file selection required

### Data Directory

The save file path is configured in `server/docker-compose.yml`. By default, it mounts the Cemu save directory to `/app/data` inside the container.