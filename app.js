var express = require('express');
var exphbs = require('express-handlebars');
var http = require('http');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  console.log(req.query.term);
  var queryString = req.query.term;
  // encode queryString to remove whitespace and restricted chars
  var term = encodeURIComponent(queryString);
  // put search term into Giphy API search URL
  var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC';
  
  http.get(url, function(response) {
    // set encoding of response to utf-8
    response.setEncoding('utf-8');

    var body = '';

    response.on('data', function(d) {
      // continuously update stream w/ data from Giphy
      body += d;
    });

    response.on('end', function() {
      // when data fully recieved, parse into JSON
      var parsed = JSON.parse(body);
      // render home template, pass gif data into template
      res.render('home', {gifs: parsed.data});
    });
  });
})

app.get('/hello-gif', function(req, res) {
  var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
  res.render('hello-gif', {gifUrl: gifUrl})
})

app.get('/greetings/:name', function(req, res) {
  var name = req.params.name;
  res.render('greetings', {name: name});
})

app.listen(3000, function() {
  console.log('Gif Search listening on port localhost:3000!');
});