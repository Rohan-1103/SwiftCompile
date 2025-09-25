const { WebSocketServer } = require('ws');
const { server } = require('./server');
const { handleInteractiveExecution } = require('./controllers/interactive.controller');

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected for interactive session');
  handleInteractiveExecution(ws);
});

console.log('WebSocket server is running');
