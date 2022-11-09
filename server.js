import express from 'express';
const app = express()
import WebSocket, { WebSocketServer } from "ws";

import bodyParser from "body-parser"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let CurrentQuestion = 0


let questions = [
  {
    question: "Etes-vous égoïste ou altruiste",
    response: ["égoiste", "altruiste"]
  },
  {
    question: "Si quelqu'un se fait agresser par plusieurs personnes armées dans la rue",
    response: ["Vous partez", "Vous aidez la personne"]
  },
//   {
//     question: "Si un membre de votre famille se fait agresser par plusieurs personnes armées dans la rue",
//     response: ["Vous partez", "Vous aidez la personne"]
//   },
  {
    question: "Pensez vous qu'avec l'age on devient :",
    response: ["aucun des deux", "Altruiste", "égoïste"]
  },
  {
    question: "Selon vous, existe-t'il différent type d'altruisme et d'égoïsme",
    response: ["non", "oui"]
  },
  {
    question: "Pour vous, être égoïste/altruiste, c'est :",
    response: ["Un choix", "Un instinct"]
  },
  {
    question: "Etes-vous égoïste ou altruiste",
    response: ["égoiste", "altruiste"]
  }
]

let questionRespones = []
let UsersPerQuestion = []
let Users = []


for (let i = 0; i < questions.length; i++) {
  questionRespones.push({})
  UsersPerQuestion.push([])
}

app.use(express.static('public'))
app.get('/form', function(req, res) {
  let response = {
    firstname: req.query.firstname,
    name: req.query.name
  };
  if (!(Users.some(e => e.firstname === response.firstname) && Users.some(e => e.name === response.name))) {
    Users.push({ firstname: response.firstname, name: response.name })
  }
  res.sendFile(__dirname + "/public/form.html");
})
app.get('/admin', function(req, res) {
  let response = {
    firstname: req.query.firstname,
    name: req.query.name
  };
  if (response.name == "clemenceau" && response.firstname == "thomas") {
    res.sendFile(__dirname + "/public/admin.html");
  } else {
    res.send("Cannot GET /test")
  }
})


app.get('/users', function(req, res) {
  let response = {
    firstname: req.query.firstname,
    name: req.query.name
  };
  res.sendFile(__dirname + "/public/users.html");
})


let jsonParser = bodyParser.json()
app.post('/admin', jsonParser, function(req, res) {
  res.header('Access-Control-Allow-Origin', 'https://philoproject.herokuapp.com');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.body.type === "nextquestion" && questions.length > CurrentQuestion + 1) {
    CurrentQuestion += 1
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "SendData", showquestion: true, data: questions[CurrentQuestion] }));
      }
    });
    res.send(JSON.stringify({ CurrentQuestionNumber: CurrentQuestion, CurrentQuestion: questions[CurrentQuestion] }));
  } else if (req.body.type === "resetquestion") {
    questionRespones = []
    UsersPerQuestion = []

    for (let i = 0; i < questions.length; i++) {
      questionRespones.push({})
      UsersPerQuestion.push([])
    }
    CurrentQuestion = 0
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "SendData", showquestion: true, data: questions[CurrentQuestion] }));
      }
    });
    res.send(JSON.stringify({ CurrentQuestionNumber: CurrentQuestion, CurrentQuestion: questions[CurrentQuestion] }));
  }
});

var server = app.listen(process.env.PORT || 3000, "0.0.0.0", function() {
  //var server = app.listen(8000, "0.0.0.0", function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Express app listening at http://%s:%s', host, port)

})

const wss = new WebSocketServer({ server: server })

wss.on("connection", function connection(ws) {
  ws.on("message", function message(message) {
    const data = JSON.parse(message);
    switch (data.type) {
      case "RequestData":
        wss.clients.forEach((client) => {
          if (client == ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "SendData", showquestion: !UsersPerQuestion[CurrentQuestion].includes(data.firstname + " " + data.name), data: questions[CurrentQuestion] }));
          }
        });
        break;
      case "RequestAllData":
        wss.clients.forEach((client) => {
          if (client == ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "SendAllData", data: questionRespones, questions: questions, users: Users }));
          }
        });
        break;
      case "Response":
        questionRespones[CurrentQuestion][data.firstname + "." + data.name] = { "name": data.name, "firstname": data.firstname, "value": data.value }
        UsersPerQuestion[CurrentQuestion].push(data.firstname + " " + data.name)
        break;
    }
  });
});
