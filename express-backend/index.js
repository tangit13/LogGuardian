// server.mjs
import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.static(join(__dirname, '../frontend/build')));

// Static logs from CSV
app.get('/logs', (req, res) => {
  const csvPath = join(__dirname, '../backend/resources/anomalies.csv');
  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read anomalies.csv' });
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const logs = lines.slice(1).map(line => {
      const values = line.split(',');
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
    res.json(logs);
  });
});

// ✅ Real-time Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');

  // Match the frontend emitter event name
  socket.on('new-log', (log) => {
    console.log('Received log:', log);
    io.emit('new-log', log); // Broadcast
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// React fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
