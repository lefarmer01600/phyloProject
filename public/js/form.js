
$(function() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    $('.p-t-136').text(params.firstname + " " + params.name)
    let host = location.origin.replace(/^http/, 'ws')
    console.log(host)
    const ws = new WebSocket(host)
    //const ws = new WebSocket("ws://localhost:8000")

    ws.addEventListener("message", function(event) {

      const data = JSON.parse(event.data)
      //console.log(data)
      if (data.showquestion) {
        $("#questionContainer").show()
        $("#Replied").hide()
        $(".responses").each(function(index) {
          $(this).remove()
        });
        $("#Question").html(data.data.question)
        for (let i = 0; i < data.data.response.length; i++) {
          let tempHtml = "<div class='container-login100-form-btn responses'><input type='button' class='response-form-btn' name='submit'  value='" + data.data.response[i] + "'></div>"
          $("#Question").after(tempHtml)
        }

        $(".response-form-btn").click(function() {
          $("#questionContainer").hide()
          $("#Replied").show()
          ws.send(JSON.stringify({ type: "Response", name: params.name, firstname: params.firstname, value: $(this).val() }))
        });
      } else {
        $("#questionContainer").hide()
        $("#Replied").show()
      }
    })
    ws.onopen = (event) => {
      ws.send(JSON.stringify({ type: "RequestData", name: params.name, firstname: params.firstname }))
    }
})
