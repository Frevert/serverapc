var http = require('http');
var express = require('express');
var app = express();
var NodeCouchDb = require('node-couchdb');
var couch = new NodeCouchDb({
	host:'www.wasdabyx.de',
	protocol:'http',
	port:5984
});
var couch2 = new NodeCouchDb({
	host:'www.wasdabyx.de',
	protocol:'http',
	port:5984
});

app.use(express.json());

app.get('/config', function(req,res){
	couch.get("example_sensor", "config").then(({data,headers, status}) => {
		res.send(data);
	}, err => {
		res.send(err.message);
	});
});

var message = ' ';

app.put('/', function(req, res){
	if(req.body.id == null) {
		res.status(404).send("Missing id");
	}else{
		couch.get("allraspberrys", req.body.id).then(({data, headers, status}) => {
			res.sendStatus(200);
			req.body.data.forEach((data) => {
				couch2.insert("rasp_"+req.body.id, {
					timestamp: data.timestamp,
					humidity: data.humidity,
					pm10: data.pm10,
					pm25: data.pm25
				}).then(({data, headers, status}) =>{
					
				}, err => {
					
				})
			});
		}, err => {
			res.status(404).send(err.EDOCMISSING);
		});
	}
});
app.listen(65000);
