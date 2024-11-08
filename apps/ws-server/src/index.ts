import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { processRequests } from "./utils";
import { userManager } from "./lib/userManager";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log(`${new Date().toISOString()} New client connected`);
  ws.on("error", console.error);

  ws.on("message", (message) => {
    userManager.handleIncomingWsRequest(message, ws);

    console.log(`Recieved message`, message);
  });

  ws.on("close", () => {
    // handleConnectionClosed(ws);
  });
});

async function startServer() {
  try {
  } catch (error: any) {
    server.listen(8080, () => {
      console.log("Server started at Port 8080 ... ");
    });
    console.log("Error while starting the server");
  }

  await processRequests();
}

startServer();
