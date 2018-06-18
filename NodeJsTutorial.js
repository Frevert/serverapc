var express = require('express');
var formidable = require('formidable');

var app = express();

app.use(express.static('puplic'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req,res) {
	var form = new formidable.IncomingForm();
	
	form.parse(req);
	
	form.on('fileBegin', function(name, file) {
		file.path = __dirname + '/puplic/' + file.name;
	});
	
	form.on('file', function(name, file) {
		console.log('Uploaded ' + file.name);
	});
	
	res.sendFile(__dirname + '/index.html');
});

app.listen(80);
