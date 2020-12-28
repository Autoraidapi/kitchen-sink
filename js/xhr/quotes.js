var quotePara = document.querySelector('blockquote p');

getQuotes('https://assets.codepen.io/1674766/quotes.json', populateJson);

var intervalID = window.setInterval(showQuote, 2000);

function getQuotes(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'text';
  request.send();

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      callback(JSON.parse(request.response));
    }
  };
}

var quoteJson;

function populateJson(response) {
  quoteJson = response;
}

function showQuote() {
  var random = Math.floor((Math.random() * 75));
  quotePara.textContent = quoteJson[random].quote + ' -- ' + quoteJson[random].author;
}