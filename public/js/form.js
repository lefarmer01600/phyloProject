
$(function() {
    window.onload = (e) => {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      $('.p-t-136').text(params.firstname + " " + params.name)
  
      const ws = new WebSocket("wss://phyloproject.lefarmer01600.repl.co:443")
  
      ws.addEventListener("message", function(event) {
        const data = JSON.parse(event.data)
        console.log(data)
        // switch (data.type) {
        //     case "DataMessage":
        //         if (markers["PID" + data.data.id] == undefined) {
        //             markers["PID" + data.data.id] = L.marker([data.data.Coords.y, data.data.Coords.x], { icon: IconsType[data.data.Vehicle] }).addTo(mymap).bindPopup("Player Name : " + data.data.Name + ",<br> Pid : " + data.data.id + "<br> X: " + parseInt(data.data.Coords.x) + " Y: " + parseInt(data.data.Coords.y) + " Z: " + parseInt(data.data.Coords.z))
        //         } else {
        //             markers["PID" + data.data.id].setLatLng([data.data.Coords.y, data.data.Coords.x])
        //             markers["PID" + data.data.id].getPopup().setContent("Player Name : " + data.data.Name + ",<br> Pid : " + data.data.id + ",<br> X: " + parseInt(data.data.Coords.x) + " Y: " + parseInt(data.data.Coords.y) + " Z: " + parseInt(data.data.Coords.z))
        //             markers["PID" + data.data.id].setIcon(IconsType[data.data.Vehicle])
        //         }
        //         break;
        // }
      })
      ws.onopen = (event) => {
        ws.send(JSON.stringify({ type: "RequestData" }))
      }
  
      $(".response-form-btn").click(function() {
        ws.send(JSON.stringify({ type: "Response", name: params.name, firstname: params.firstname, value: $(this).val() }))
      });
    }
  })