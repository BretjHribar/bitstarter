var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var fileIn = fs.readFileSync('index.html');

//var bufferOut = fileIn. 

app.get('/', function(request, response) {

  response.send('Hello World 4!' + fileIn.toString());

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
