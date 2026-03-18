# Unexplored Area Viewer for The Legend of Zelda: BOTW

### Because there _really_ needed to be 900 of them, right?

A fixed sidebar on the left tracks your progress:

#### Map Stats
Each entry is color-coded, hoverable, and toggleable:

| Metric | Color | Total |
|--------|-------|-------|
| Korok seeds | Green | 900 |
| Locations | Orange | 226 |
| Shrines Discovered | Cyan | 120 |
| Shrines Completed | Yellow | 120 |
| Towers | Violet | 15 |
| Divine Beasts | Red | 4 |
| Player Position | White | — |

Each metric row shows the stat label on the left and its count on the right, with a color bar below. The sidebar remembers which categories you have toggled off between sessions.

- **Hover** over a metric to highlight all matching icons on the map with a glowing ring
- **Click** a metric to show/hide that icon type on the map; hidden categories appear dimmed in the sidebar and the state persists across browser sessions
- **Player Position** places a glowing white marker on the map at your character's last saved location. When the save was made inside a shrine, the marker appears at the shrine's overworld entrance rather than its local interior coordinates (detected via the MAP save flag)

#### Track Player

A **Track Player** toggle sits below the Player Position row. When enabled (green), the map smoothly pans and zooms to the player's position after each save file refresh — keeping your character in view as you play. When disabled (red), the map stays at whatever location and zoom level you set. A slider beneath the toggle controls the zoom level used when tracking; the value persists between sessions.

#### Player Stats
Read directly from the save file — no game interaction required:

| Stat | Notes |
|------|-------|
| Hearts | Max heart containers |
| Stamina | Max stamina wheels (1.0–3.0 in 0.2 increments) |
| Playtime | Total time played (H:MM:SS) |
| Rupees | Current rupee count |
| Motorcycle | Green = Master Cycle owned, Red = not yet |

#### Icon Shapes
Map icons use shape and color to indicate type:

- **Circles** — Korok seeds (green) and Locations (orange)
- **Diamonds** — Shrines discovered (cyan), Shrines completed (yellow), Towers (violet), Divine Beasts (red), and other Warp Points
- **Glowing circle** — Player position (white)

Hovering over any map icon shows a floating label offset to the side of the pin. Labels are zoom-aware — they scale up when zoomed out to stay readable, and maintain a consistent gap from the pin at all zoom levels. Labels use a semi-transparent dark style so the map remains visible behind them. When the player is inside a shrine, the player marker label reads **Player (In Shrine)**.

Scrolling the mouse wheel shows a brief zoom percentage indicator in the bottom-right corner of the map.

A server status indicator and save file timestamp at the bottom of the sidebar show server reachability and when your save was last read.

### Live Data API

The viewer exposes a JSON endpoint that serves as a live data feed of your current save state:

```
GET http://localhost:3000/api
```

Since the server polls for save file changes every 10 seconds, this endpoint always reflects your most recent manual save — no game modification or plugin required. External systems can poll `/api` on any interval to react to changes in game state.

```json
{
  "console": "XX",
  "KOROK_SEED_COUNTER": XX,
  "MAX_HEARTS": XX,
  "MAX_HEARTS_display": XX,
  "MAX_STAMINA": XX,
  "MAX_STAMINA_display": XX,
  "PLAYTIME": XX,
  "PLAYTIME_formatted": "XX:XX:XX",
  "RUPEES": XX,
  "MOTORCYCLE": XX,
  "PLAYER_POSITION": { "x": XX, "y": XX, "z": XX, "raw_hex": "XX" },
  "MAP": XX,
  "MAPTYPE": XX,
  "locations":          { "found": XX, "total": 226 },
  "shrines_discovered": { "found": XX, "total": 120 },
  "shrines_completed":  { "found": XX, "total": 120 },
  "towers":             { "found": XX, "total": 15 },
  "divine_beasts":      { "found": XX, "total": 4 },
  "koroks_discovered":  { "found": XX, "total": 900 }
}
```

This data can serve as a live input feed for a wide range of external systems:

- **Stream overlays** — display live completion stats or player coordinates in OBS or browser-source overlays
- **Discord bots** — post milestone notifications when a Korok seed count or shrine count crosses a threshold
- **Home automation** — trigger lighting scenes or alerts based on game progress
- **Spreadsheets / logging** — poll on a cron schedule and append rows to track progress over a play session
- **Webhooks and pipelines** — feed into any HTTP-based automation tool (Zapier, n8n, Home Assistant, etc.)

![Unexplored Area Viewer screenshot](Screenshot.jpg)

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
- The map automatically refreshes with each **Manual Save**. Autosave checkpoints do not trigger a refresh.

### Supported Game Versions

Wii U and Switch saves are both supported. Recognized versions: v1.0, v1.1, v1.2, v1.3, v1.3.1, v1.3.3, v1.3.4, v1.4, v1.5, v1.5*, v1.6, v1.6*, v1.6**, v1.6***, v1.8, Kiosk. Modded saves with non-standard file sizes are also accepted.
