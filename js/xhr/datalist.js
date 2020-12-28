const datalist = document.getElementById("json-datalist");
const input = document.getElementById("search");

const request = new XMLHttpRequest();

request.onreadystatechange = function(response) {
  if (request.readyState === 4) {
    if (request.status === 200) {   
			const jsonOptions = JSON.parse(request.responseText);
      jsonOptions.forEach(function(item) {
        const option = document.createElement("option");
        option.value = item;
        datalist.appendChild(option);
      });
			setTimeout(function(){
				input.placeholder = "Data List";				
			}, 500);
    } else {
      input.placeholder = "Couldn't load datalist options :(";
    }
  }
};

input.placeholder = "Loading options...";

request.open( "GET", "../../json/datalist.json", true );
request.send(null);