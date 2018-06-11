//Methode 1
/*const http = require('http');

const options = {
	hostname: 'tester:secret@www.wasdabyx.de',
	port:5984,
	path:'/',
	method: 'PUT'	
};

const req = http.request(options, (res) => {
	console.log('statusCode:',res.statusCode);
	console.log('headers:', res.headers);
	
	res.on('data', (d) => {
		process.stdout.write(d);
	});
});

req.on('error', (e) => {
	console.error(e);
});
req.end();*/


//methode2
/*var options = {
	host: 'www.wasdabyx.de',
	port: 5984,
	path:'/',
	headers:{
		'Authorization':'Basic ' + new Buffer(username +':'+passw).toString('base64')
	}
};

//this is the call
request = https.get(options, function(res){
	var body = "";
	res.on('data', function(data){
		body+=data;
	});
	res.on('end', function(){
		console.log(body);
	});
	res.on('error', function(e){
		console.log("Got error: " + e.message);
	});
});*/

//methode3
/*const postData = querystring-stringify({
	'msg':'Hello World!'
});

const options = {
	hostname: 'www.wasdabyx.de',
	port: 5984,
	method: 'PUT',
	auth: 'tester:secret',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(postData)
	}
};

const req = http.request(options, (res) => {
	console.log('Status: ${res.statusCode}');
	console.log('HEADERS: ${JSON.stringify(res.headers)}');
	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		console.log('BODY: ${chunk}');
	});
	res.on('end', () =>{
		console.log('No more data in response.');
	});
});

req.on('error'. (e)=>{
	console.error('problem with request : ${e.message}');
});

req.write(postData);
req.end();