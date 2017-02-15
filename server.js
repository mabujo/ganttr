var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var sprints = require('./server/sprints.js');

app.use(bodyParser.json());

// get main page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  console.log("Served main page");
});

// get all sprints
app.get('/sprints/', function (req, res) {

  console.log("Served all sprints");
  var response = sprints.getAll(req);

  return res.json(response);

});

// get single sprint
app.get('/sprints/:id', function (req, res) {

  var response = sprints.get(req, res);

  return res.send(response);

});

// save a sprint
app.post('/sprints/', function (req, res) {
  var response = sprints.save(req);
  res.send(response);
});

// static serve other files
app.use(express.static('./'));

// start server
app.listen(3000, function () {
  console.log('Server started, goto http://localhost:3000/');
});