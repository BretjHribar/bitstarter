var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

//var fileIn = fs.readFileSync('index.html');
 

app.get('/', function(request, response) {

  var fileIn = fs.readFileSync('index.html');
  response.send(fileIn.toString());

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
