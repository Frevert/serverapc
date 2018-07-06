var mail = require('nodemailer');


exports.MailSenden = function(empfaenger, inhalt, sensor){
var transp = mail.createTransport({
	service: 'gmail',
	auth: {
		user: "michaelfrevert@googlemail.com",
		pass: "m1ch43l92"
	}
});

var mailOptions = {
	from: 'michaelfrevert92@googlemail.com',
	to: empfaenger,
	subject: 'Statusmeldung für Sensor_' + sensor,
	text: inhalt
}

transp.sendMail(mailOptions, function(error, info){
	if(error){
		console.log(error);
	}else{
		console.log('Email sent: ' + info.response);
	}
});
};
