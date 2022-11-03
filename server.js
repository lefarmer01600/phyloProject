// const express = require('express')
import express from 'express';
const app = express()
import WebSocket, { WebSocketServer } from "ws";
app.use(express.static('www'));
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wss = new WebSocketServer({ port: 3000 });
let response

let CurrentQuestion = 0

let questionRespones = [[]]


app.get('/form', function (req, res) {
    response = {
        firstname: req.query.firstname,
        name: req.query.name
    };
    res.sendFile(__dirname + "/www/" + "form.html");
})

var server = app.listen(8000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)

})

wss.on("connection", function connection(ws) {
    ws.on("message", function message(message) {
        const data = JSON.parse(message);
        switch (data.type) {
            // case "DataMessage":
            //     wss.clients.forEach((client) => {
            //         if (client !== ws && client.readyState === WebSocket.OPEN) {
            //             InfoSave["PID" + data.data.id] = data.data
            //             client.send(JSON.stringify({ type: "DataMessage", data: data.data }));
            //         }
            //     });
            //     break;
            case "RequestData":
                wss.clients.forEach((client) => {
                    if (client == ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "SendData", data: "test" }));
                    }
                });
                break;
            case "Response":
                console.log(data)
                questionRespones[CurrentQuestion].push({ "name": data.name, "firstname": data.firstname, "value": data.value })
                console.log(data, JSON.stringify(questionRespones[CurrentQuestion]))
                break;
        }
    });
});