var express = require('express');
var app = express();

app.get('/', function(req,res){
	res.send('GET request to the homepage');
})

app.put('/', function(req,res){
	res.send('PUT request to the homepage);
});