//To be run on Vercel server
import path from "path";
import express from "express";
import { WebSocketServer } from "ws";
import { parse } from "url";

const app = express();
const __dirname = path.resolve();
const server = app.listen(8080);
const wss = new WebSocketServer({ noServer: true });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/status", (req, res) => {
  res.status(200);
});

let wssClients;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("received: %s", data);
  });

  ws.send("skibidibapmbadap");

  app.get("/go", (req, res) => {
    res.status(200)
    console.log(req)
    ws.send("/cue/selected/go");
  });
  wssClients = wss.clients;
});

app.get("/go", (req, res) => {
    res.status(200)
    wssClients.forEach(client => {
        client.send("/cue/selected/go");
    });
  });

server.on("upgrade", (request, socket, head) => {
  const { pathname } = parse(request.url);

  if (pathname === "/websocket") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});
