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
  connection.query("SELECT * FROM portfolioshist where date = (select max(date) from portfolioshist)", function(err, data){
    res.json(data);
  });
});

app.get('/sectorsApi', function(req, res){
  connection.query('select user,industrial, basicmaterials, technology,consumercyclical,financial,utilities,consumernoncyclical,communications,energy,diversified,funds,other from portfolioshist where date = (select max(date) from portfolioshist)', function(err, data){
    res.json(data);
  });
});

app.get('/trades', function(req,res){
	connection.query('select tradeshist.id,portfolioshist.user, Ticker, TradePrice as OpenPrice, Quantity from tradeshist join portfolioshist on tradeshist.Portfolio = portfolioshist.name where  TradeDate = (select max(TradeDate) from tradeshist) group by tradeshist.id', function(err,data){
		res.json(data);
	});
});

app.get('/positions', function(req,res){
  connection.query('select positionshist.id,portfolioshist.user, ticker, price as OpenPrice, Quantity from positionshist join portfolioshist on positionshist.Portfolio = portfolioshist.name where  positionshist.date = (select max(positionshist.date) from positionshist) group by positionshist.id', function(err,data){
    res.json(data);
  });
});
// var portfolios = ['Main2', 'alphaness_legov', 'icg', 'nadav', 'oriskany', 'alphaness', 'hnl', 'liquant', 'Main', 'idx']
// var portfoliosLen = portfolios.length;

// for(i = 0; i < portfoliosLen; i++){

// 	var practice = " select tradeshist.id,portfolioshist.user, Ticker, TradePrice as OpenPrice, Quantity from tradeshist join portfolioshist on tradeshist.Portfolio = portfolioshist.name where user = 'nadav' group by tradeshist.id and TradeDate = (select max(TradeDate) from tradeshist)"
// 	var query = "select tradeshist.id,portfolioshist.user, Ticker, TradePrice as OpenPrice, Quantity from tradeshist join portfolioshist on tradeshist.Portfolio = portfolioshist.name where user = '" + portfolios[i] +"' and TradeDate = (select max(TradeDate) from tradeshist) group by tradeshist.id";
// 	console.log('The query for ' + portfolios[i] + 'is ' + practice);
// 	app.get("/" + portfolios[i],function(req,res){
// 		connection.query(practice, function(err,data){
// 		res.json(data);
// 		});
// 	});
// }

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));