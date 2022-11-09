$(function() {
  var host = location.origin.replace(/^http/, 'wss')
  const ws = new WebSocket(host)
  //const ws = new WebSocket("ws://localhost:8000")

  ws.addEventListener("message", function(event) {

    const data = JSON.parse(event.data)
    document.getElementById("currentQuestion").innerHTML = data.questions[0].question
  })
  ws.onopen = (event) => {
    ws.send(JSON.stringify({ type: "RequestAllData" }))
  }

})

$("#next").click(function() {
  var xhr = new XMLHttpRequest();
  //var url = "http://localhost:8000/admin";
  var url = "https://phyloProject.lefarmer01600.repl.co/admin";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      //console.log(xhr.response);
      let tempTab = JSON.parse(xhr.response)
      document.getElementById("currentQuestion").innerHTML = tempTab.CurrentQuestion.question
      //console.log(tempTab.CurrentQuestionNumber)
      document.getElementById("questionNum").innerHTML = "Question Numero : " + (tempTab.CurrentQuestionNumber + 1)
    }
  };
  var data = { type: "nextquestion" };
  xhr.send(JSON.stringify(data));
});

$("#reset").click(function() {
  var xhr = new XMLHttpRequest();
  var url = "https://phyloProject.lefarmer01600.repl.co/admin";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let tempTab = JSON.parse(xhr.response)
      document.getElementById("currentQuestion").innerHTML = tempTab.CurrentQuestion.question
      document.getElementById("questionNum").innerHTML = "Question Numero : " + (tempTab.CurrentQuestionNumber + 1)
    }
  };
  var data = { type: "resetquestion" };
  xhr.send(JSON.stringify(data));
});
