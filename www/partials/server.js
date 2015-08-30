//server
var express = require('express');
var app = express();

app.get('/', function (req, res) {
	//codigo
	res.send('Hola Mundo!');
});

var server = app.listen(8000, function () {
	console.log('Servidor escuchando en el puerto :3000');
});