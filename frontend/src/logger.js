import io from 'socket.io-client';

const socket = io();
const channel = new BroadcastChannel('log_channel');

// Unique session ID for this tab
const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

// Emit + Broadcast log (with loop prevention)
function emitLog(type, message, shouldBroadcast = true) {
  const log = {
    Timestamp: new Date().toISOString(),
    AnomalyType: type,
    Message: `[Tab ${sessionId}] ${message}`,
  };
  socket.emit('new-log', log);
  if (shouldBroadcast) channel.postMessage(log); // cross-tab broadcast
}

// Receive logs from other tabs
channel.onmessage = (event) => {
  const log = event.data;
  if (!log.Message.includes(sessionId)) {
    socket.emit('new-log', log);
  }
};

// Initial browser info
const browserInfo = `Browser: ${navigator.userAgent}, Screen: ${window.innerWidth}x${window.innerHeight}`;
emitLog('INFO', `Session started — ${browserInfo}`);

// Track session duration
const sessionStart = Date.now();

// Emit live duration every 10 seconds
setInterval(() => {
  const duration = ((Date.now() - sessionStart) / 1000).toFixed(0);
  emitLog('INFO', `Live session duration: ${duration} seconds`);
}, 10000);

// Emit final duration on unload
window.addEventListener('beforeunload', () => {
  const duration = ((Date.now() - sessionStart) / 1000).toFixed(2);
  emitLog('INFO', `Session ended — Duration: ${duration} seconds`);
});

// Click logger
window.addEventListener('click', (e) => {
  emitLog('INFO', `Click at (${e.clientX}, ${e.clientY}) on <${e.target.tagName.toLowerCase()}>`);
});

// Key logger
window.addEventListener('keydown', (e) => {
  emitLog('WARN', `Key pressed: ${e.key}`);
});

// Tab visibility tracker
document.addEventListener('visibilitychange', () => {
  const status = document.visibilityState === 'visible' ? 'visible' : 'hidden';
  emitLog('INFO', `Tab visibility changed: ${status}`);
});
