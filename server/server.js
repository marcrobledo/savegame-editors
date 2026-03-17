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

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('Save file not found');
            return;
        }
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', data.length);
        res.setHeader('Cache-Control', 'no-store');
        res.send(data);
    });
});

// Server-Sent Events endpoint for file change notifications
app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const filePath = path.join(__dirname, DATA_PATH);

    // Store last file modification time and size for change detection
    let lastMtime = null;
    let lastSize = null;
    try {
        const stats = fs.statSync(filePath);
        lastMtime = stats.mtimeMs;
        lastSize = stats.size;
    } catch (err) {
        console.error('Initial file check error:', err);
    }

    // Send initial connection message with current mtime
    res.write('data: ' + JSON.stringify({ event: 'connected', mtime: lastMtime }) + '\n\n');

    // Poll for file changes every 3 seconds
    const interval = setInterval(() => {
        try {
            const stats = fs.statSync(filePath);
            const changed = (lastMtime !== null && stats.mtimeMs !== lastMtime)
                         || (lastSize !== null && stats.size !== lastSize);
            if (changed) {
                lastMtime = stats.mtimeMs;
                lastSize = stats.size;
                res.write('data: ' + JSON.stringify({ event: 'changed', mtime: stats.mtimeMs }) + '\n\n');
            } else if (lastMtime === null) {
                lastMtime = stats.mtimeMs;
                lastSize = stats.size;
            }
        } catch (err) {
            // File might not exist yet
            console.error('File check error:', err);
        }
    }, 3000);

    // Clean up on close
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
