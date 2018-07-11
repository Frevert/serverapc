var express = require('express');
var app = express();
var NodeCouchDb = require('node-couchdb');
var sendMail = require('./demo_sendmail');

app.use(express.json());

var couch = new NodeCouchDb({
	host:'www.wasdabyx.de',
	protocol:'http',
	port:5984
});

app.get('/', function(req,res){
	couch.get("all_sensors", "sensor_" + 12345).then(({data, headers, status}) => {
		data.userId.forEach((userId) => {
			console.log(userId);
			couch.get("all_users", userId).then(({data, headers, status}) => {
				if(data.emailnotification){
					sendMail.MailSenden(data.email, "Gesendet");
				}
			}, err => {
				console.log(err.message);
			});
		});
		res.sendStatus(200);
	}, err => {
		console.log(err.message);
		res.sendStatus(404);
	});
});

app.listen(8081);
