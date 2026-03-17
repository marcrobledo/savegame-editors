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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
