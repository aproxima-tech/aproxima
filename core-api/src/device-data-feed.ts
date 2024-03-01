import type { WorkerEnvironment } from './api';

export class DeviceDataFeed {
  state: DurableObjectState;
  env: WorkerEnvironment;

  constructor(state: DurableObjectState, env: WorkerEnvironment) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      const url = new URL(request.url);
      const method = request.method;
      const path = url.pathname;
      if (method === 'POST' && path.includes('/devices/') && path.endsWith('/data')) {
        const data = await request.json();
        this.state.getWebSockets().forEach((socket) => {
          socket.send(JSON.stringify(data));
        });
      } else {
        return new Response('Bad request', { status: 400 });
      }
    }

    const pair = new WebSocketPair();
    const clientSocket = pair[0];
    const serverSocket = pair[1];

    this.state.acceptWebSocket(serverSocket);
    return new Response(null, { status: 101, webSocket: clientSocket });
  }
}
