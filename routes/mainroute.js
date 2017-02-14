var express = require('express');
var router = express.Router();
var connection = require('connection')

app.GET('/mainroute', function(req, res){
  connection.query('SELECT * FROM book', function(err, data){
    if (err) return (err);
  		res.json(data);
  });
});

module.exports = router;