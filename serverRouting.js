var http = require('http');
var express = require('express');
var app = express();
var url = require('url');
var NodeCouchDb = require('node-couchdb');
var sendMail = require('./demo_sendmail');

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
	couch.get("all_sensors", req.param('id')).then(({data,headers, status}) => {
		responseJson = '{"id": ' + data.config.identifier + ', "url":"http://www.wasdabyx.de:8080","interval":' + data.config.interval+'}';
		res.send(responseJson);
	}, err => {
		res.send(err.message);
	});
});

var message = ' ';

app.put('/', function(req, res){
	if(req.body.id == null) {
		res.status(404).send("Missing id");
	}else{
		couch.get("all_sensors", req.body.id).then(({data, headers, status}) => {
			var config = data.config;
			res.sendStatus(200);
			req.body.data.forEach((data) => {
				checkData(data, config);
				couch2.insert("sensor_"+req.body.id, {
					timestamp: data.timestamp,
					temperature: data.temperature,
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
app.listen(8080);


checkData = function(data, config){
	if(data.temperature>=config.temperature_limit){
		sendMail.MailSenden(config.userId[0], "Temperature is over " + config.temperature_limit);
	}
	if(data.humidity>= config.humidity_limit){
		sendMail.MailSenden(config.userId[0], "Humidity is over " + config.humidity_limit);
	}
	if(data.pm25>=config.pm25_limit){
		sendMail.MailSenden(config.userId[0], "Value of pm2.5 is over " + config.pm25_limit);
	}
	if(data.pm10>=config.pm10_limit){
		sendMail.MailSenden(config.userId[0], "Value of pm 10 is over " + config.pm10_limit);
	}
}
