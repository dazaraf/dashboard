var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();
var index = require('./routes/index');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dudu',
  password : '12041992',
  database: 'mayan'
});

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/', index);

app.get('/api', function(req, res){
  connection.query('SELECT * FROM portfolioshist where date = (select max(date) from portfolioshist)', function(err, data){
    res.json(data);
  });
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));