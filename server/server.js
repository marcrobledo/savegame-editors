/**
 * server.js — Express server for the BotW Unexplored Area Viewer
 *
 * Responsibilities:
 *   - Serve static frontend files (HTML, CSS, JS, map image)
 *   - Proxy the Cemu save file to the browser via /data/game_data.sav
 *   - Expose /api/mtime so the browser can poll for save file changes
 *   - Parse save file metrics server-side and expose them via /api (debug)
 *
 * Save file path is configured via SAVE_PATH in server/.env, mounted
 * into the container at /app/data/game_data.sav.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_PATH = 'data/game_data.sav';

// Store file stats for change detection
let lastFileStats = null;

// Serve static files from app directory (where Dockerfile copies them)
app.use(express.static(__dirname));

// Serve the game save file
app.get('/data/game_data.sav', (req, res) => {
    const filePath = path.join(__dirname, DATA_PATH);

    fs.stat(filePath, (statErr, stats) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.status(404).send('Save file not found');
                return;
            }
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Length', data.length);
            res.setHeader('Cache-Control', 'no-store');
            if (!statErr) res.setHeader('X-File-Mtime', stats.mtimeMs);
            res.send(data);
        });
    });
});

// Lightweight mtime endpoint — browser polls this to detect file changes
app.get('/api/mtime', (req, res) => {
    const filePath = path.join(__dirname, DATA_PATH);
    fs.stat(filePath, (err, stats) => {
        res.setHeader('Cache-Control', 'no-store');
        res.json({ mtime: err ? null : stats.mtimeMs });
    });
});

// Parse map-locations.js to extract hash → internal_name tables for each category
function loadMapHashes() {
    const content = fs.readFileSync(path.join(__dirname, 'assets/js/map-locations.js'), 'utf8');

    function extractSection(name) {
        const start = content.indexOf(`var ${name} = {`);
        if (start < 0) return {};
        const end = content.indexOf('\n    };', start);
        const section = content.slice(start, end);
        const result = {};
        const re = /0x([0-9a-fA-F]+):\s*\{"internal_name":"([^"]+)"/g;
        let m;
        while ((m = re.exec(section)) !== null)
            result[parseInt(m[1], 16)] = m[2];
        return result;
    }

    const warps = extractSection('warps');
    const shrines = {}, towers = {}, divineBeasts = {}, otherWarps = {};
    for (const h in warps) {
        const n = warps[h];
        if (n.startsWith('Location_Dungeon'))   shrines[h] = n;
        else if (n.startsWith('Location_MapTower')) towers[h] = n;
        else if (n.startsWith('Location_Remains')) divineBeasts[h] = n;
        else otherWarps[h] = n;
    }

    return {
        locations:         extractSection('locations'),
        shrines,
        towers,
        divineBeasts,
        koroks:            extractSection('koroks'),
        shrineCompletions: extractSection('shrineCompletions'),
    };
}

// Scan save buffer for found/total counts of a hash table
// A flag is "found" when its value field (offset+4) is non-zero
function scanFlags(buf, readU32, hashTable) {
    const found = new Set();
    const total = Object.keys(hashTable).length;
    for (let i = 0x0c; i < buf.length - 4; i += 8) {
        const hash = readU32(i);
        if (Object.prototype.hasOwnProperty.call(hashTable, hash) && readU32(i + 4) !== 0)
            found.add(hash);
    }
    return { found: found.size, total };
}

// Parse BotW save file hashes server-side for debug inspection
function parseSaveMetrics(buf) {
    function makeReaders(le) {
        return {
            u32: (o) => le ? buf.readUInt32LE(o) : buf.readUInt32BE(o),
            f32: (o) => le ? buf.readFloatLE(o)  : buf.readFloatBE(o),
        };
    }
    function searchHash(readU32, hash) {
        for (var i = 0x0c; i < buf.length - 4; i += 8)
            if (readU32(i) === hash) return i;
        return -1;
    }

    // Detect endianness via KOROK_SEED_COUNTER
    var r, le;
    var beReaders = makeReaders(false);
    var leReaders = makeReaders(true);
    if (searchHash(beReaders.u32, 0x8a94e07a) >= 0) { r = beReaders; le = false; }
    else if (searchHash(leReaders.u32, 0x8a94e07a) >= 0) { r = leReaders; le = true; }
    else return { error: 'KOROK_SEED_COUNTER not found — not a valid BotW save' };

    var metrics = { console: le ? 'Switch' : 'Wii U' };

    var targets = {
        KOROK_SEED_COUNTER: { hash: 0x8a94e07a, type: 'u32' },
        MAX_HEARTS:          { hash: 0x2906f327, type: 'u32' },  // quarter-heart units
        MAX_STAMINA:         { hash: 0x3adff047, type: 'f32' },
        PLAYTIME:            { hash: 0x73c29681, type: 'u32' },
        RUPEES:              { hash: 0x23149bf8, type: 'u32' },
        MOTORCYCLE:          { hash: 0xc9328299, type: 'u32' },
        PLAYER_POSITION:     { hash: 0xa40ba103, type: 'f32x3' },
        MAP:                 { hash: 0x0bee9e46, type: 'u32' },
        MAPTYPE:             { hash: 0xd913b769, type: 'u32' },
    };

    for (var name in targets) {
        var t = targets[name];
        var off = searchHash(r.u32, t.hash);
        if (off < 0) { metrics[name] = null; continue; }
        if (t.type === 'u32') {
            metrics[name] = r.u32(off + 4);
        } else if (t.type === 'f32') {
            metrics[name] = r.f32(off + 4);
        } else if (t.type === 'f32x3') {
            // Three consecutive [hash,value] pairs with the same hash: X at +4, Y(height) at +12, Z at +20
            metrics[name] = {
                x:       r.f32(off + 4),
                y:       r.f32(off + 12),
                z:       r.f32(off + 20),
                raw_hex: buf.slice(off, off + 24).toString('hex'),
            };
        }
    }

    // Hearts stored as quarter-heart units (÷4 = displayed heart count)
    if (metrics.MAX_HEARTS != null)
        metrics.MAX_HEARTS_display = metrics.MAX_HEARTS / 4;
    // Stamina stored as F32 in units of 1/1000 wheel
    if (metrics.MAX_STAMINA != null)
        metrics.MAX_STAMINA_display = +(metrics.MAX_STAMINA / 1000).toFixed(1);

    if (metrics.PLAYTIME != null) {
        var s = metrics.PLAYTIME;
        var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
        metrics.PLAYTIME_formatted = h + ':' + (m<10?'0'+m:m) + ':' + (sec<10?'0'+sec:sec);
    }

    // Location flag scans — mirror the sidebar metrics
    try {
        const map = loadMapHashes();
        metrics.locations         = scanFlags(buf, r.u32, map.locations);
        metrics.locations.total   = 226; // hardcoded per game sources (matches sidebar)
        metrics.shrines_discovered = scanFlags(buf, r.u32, map.shrines);
        metrics.shrines_completed  = scanFlags(buf, r.u32, map.shrineCompletions);
        metrics.towers             = scanFlags(buf, r.u32, map.towers);
        metrics.divine_beasts      = scanFlags(buf, r.u32, map.divineBeasts);
        metrics.koroks_discovered  = scanFlags(buf, r.u32, map.koroks);
    } catch (e) {
        metrics.location_scan_error = e.message;
    }

    return metrics;
}

app.get('/api', (req, res) => {
    const filePath = path.join(__dirname, DATA_PATH);
    fs.readFile(filePath, (err, data) => {
        res.setHeader('Cache-Control', 'no-store');
        if (err) { res.status(404).json({ error: 'Save file not found' }); return; }
        res.json(parseSaveMetrics(data));
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
