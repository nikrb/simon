var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 8080));

console.log( __dirname);

app.use('/', express.static(path.join(__dirname, '../dist')));
app.use( '/img', express.static( path.join( __dirname, "../src/img")));
app.use( '/audio', express.static( path.join( __dirname, "../src/audio")));

app.listen(app.get('port'), function() {
  console.log('Server started: https://localhost:' + app.get('port') + '/');
});
