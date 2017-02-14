var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dudu',
    password: '12041992',
    database: 'mayan'
});


module.exports = connection;