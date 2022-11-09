$(function() {
  let myList = [
  ];

  let barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
  ];


  // Builds the HTML Table out of myList.
  function buildHtmlTable(selector) {
    var columns = addAllColumnHeaders(myList, selector);

    for (var i = 0; i < myList.length; i++) {
      var row$ = $('<tr/>');
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var cellValue = myList[i][columns[colIndex]];
        if (cellValue == null) cellValue = "";
        row$.append($('<td/>').html(cellValue));
      }
      $(selector).append(row$);
    }
  }

  // Adds a header row to the table and returns the set of columns.
  // Need to do union of keys from all records as some records may not contain
  // all records.
  function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0; i < myList.length; i++) {
      var rowHash = myList[i];
      for (var key in rowHash) {
        if ($.inArray(key, columnSet) == -1) {
          columnSet.push(key);
          headerTr$.append($('<th/>').html(key));
        }
      }
    }
    $(selector).append(headerTr$);

    return columnSet;
  }
  let host = location.origin.replace(/^https/, 'wss')
  const ws = new WebSocket(host)
  //const ws = new WebSocket("ws://localhost:8000")

  ws.addEventListener("message", function(event) {

    const data = JSON.parse(event.data)
    for (let i = 0; i < data.data.length; i++) {
      let tempElem = document.createElement("canvas")
      tempElem.id = "chartId" + i
      document.getElementById("graphContainer").appendChild(tempElem)
      const counts = {};
      Object.keys(data.data[i]).forEach(elem => {
        if (counts[data.data[i][elem].value] == undefined) {
          counts[data.data[i][elem].value] = 1;
        }
        else {
          counts[data.data[i][elem].value] += 1;
        }
      });

      let valuesName = []
      let values = []
      for (const [key, value] of Object.entries(counts)) {
        valuesName.push(key + " : " + value)
        values.push(value)
      }
      new Chart("chartId" + i, {
        type: "pie",
        data: {
          labels: valuesName,
          datasets: [{
            backgroundColor: barColors,
            data: values
          }]
        },
        options: {
          title: {
            display: true,
            text: data.questions[i].question
          }
        }
      });
    }

    //console.log(data)
    for (let i = 0; i < data.data.length; i++) {
      let tempElem = document.createElement("table")
      let tempTitle = document.createElement("p")

      myList = []
      for (let j = 0; j < data.users.length; j++) {
        //UsersList
        if (data.data[i][data.users[j].firstname + "." + data.users[j].name] != undefined) {
          myList.push({
            name: data.users[j].name, firstname: data.users[j].firstname, response:
              data.data[i][data.users[j].firstname + "." + data.users[j].name].value
          })
        } else {
          myList.push({
            name: data.users[j].name, firstname: data.users[j].firstname, response: "none"
          })
        }

      }
      //myList = data.data[i]

      tempElem.id = "ValueTable" + i
      tempElem.classList.add("ValueTable")

      tempTitle.innerText = data.questions[i].question

      document.getElementById("tableContainer").appendChild(tempTitle)
      document.getElementById("tableContainer").appendChild(tempElem)
      buildHtmlTable("#ValueTable" + i)
    }
  })
  ws.onopen = (event) => {
    ws.send(JSON.stringify({ type: "RequestAllData" }))
  }

  function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
  $("#btnSave").click(function() {
    const screenshotTarget = document.body;

    html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      debugBase64(base64image);
    });
  });
  $("#switch").click(function() {
    $("#graphContainer").toggle()
    $("#tableContainer").toggle()
  });
})
