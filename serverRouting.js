var http = require('http');
var express = require('express');
var app = express();

app.use(express.json());

app.get('/config', function(req,res){
	res.send('GET request to the homepage\n');
})

app.put('/', function(req,res){
	res.send(JSON.stringify(req.body));
});
app.listen(8080);
