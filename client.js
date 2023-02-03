//To be run on computer with QLab
import osc from "osc";
import path from "path";
import WebSocket from 'ws';

const SERVER_IP = "127.0.0.1:8080"

const ws = new WebSocket(`ws://${SERVER_IP}/websocket`);

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});


// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 53001,
    metadata: true
});

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    const data = JSON.parse(oscMsg.args[0].value);
    console.log(oscMsg.address, data);
    // console.log("Remote info is: ", info);
});

// Open the socket.
udpPort.open();

function send(message) {
    udpPort.send({
        address: message
    }, "127.0.0.1", 53000);
    return new Promise((resolve, reject) => {
        const handle = (oscMsg, timeTag, info) => {
            const data = JSON.parse(oscMsg.args[0].value);
            resolve(data);
        };
        udpPort.on("message", handle, {once: true});
        setTimeout(() => {
            resolve();
        }, 1000)
    })
}


// When the port is read, send an OSC message to, say, SuperCollider
udpPort.on("ready", async () => {
    const workspaces = await send("/workspaces");
    const workspaceID = workspaces.data[0].uniqueID
    await send(`/workspace/${workspaceID}/connect/letsgobaby`);
    send('/alwaysReply');
    ws.on('message', function message(data) {
        send(data);
    });
});