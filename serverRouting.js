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
	couch.get("all_sensors", "sensor_" + req.param('id')).then(({data, headers, status}) => {
		responseJson = '{"id": ' + data.config.identifier + ', "url":"http://www.wasdabyx.de:8080","interval":' + data.config.interval+', "long": ' +  data.config.long + ', "lat": ' + data.config.lat + '}';
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
		couch.get("all_sensors", "sensor_" + req.body.id).then(({data, headers, status}) => {
			var config = data;
			res.sendStatus(200);
			req.body.data.forEach((data) => {
				checkEmailNotification(data, config);
				couch2.insert("sensor_"+req.body.id, {
					timestamp: data.timestamp,
					temperature: data.temperature,
					humidity: data.humidity,
					pm10: data.pm10,
					pm25: data.pm25,
					long: data.long,
					lat: data.lat
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


checkEmailNotification = function(weatherData, config){
	var userIds = config.userId;
	userIds.forEach((userId) => {
		couch.get("all_users", userId).then(({data, headers, status}) => {
			if(data.emailnotification){
				checkWeatherData(weatherData, config.config, data.email, config.config.identifier);
			}
		}, err => {
			console.log(err.message);
		});
	});
}

checkWeatherData = function(weatherData, config, emailAddress, sensorId) {
	if(weatherData.temperature>=config.temperature_limit){
		sendMail.MailSenden(emailAddress, "Temperature is over " + config.temperature_limit, sensorId);
	}
	if(weatherData.humidity>= config.humidity_limit){
		sendMail.MailSenden(emailAddress, "Humidity is over " + config.humidity_limit, sensorId);
	}
	if(weatherData.pm25>=config.pm25_limit){
		sendMail.MailSenden(emailAddress, "Value of pm2.5 is over " + config.pm25_limit, sensorId);
	}
	if(weatherData.pm10>=config.pm10_limit){
		sendMail.MailSenden(emailAddress, "Value of pm 10 is over " + config.pm10_limit, sensorId);
	}
}
