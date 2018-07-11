'use strict';
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var http = require('http');

app.use(express.static('puplic'));

/* eslint-disable */
const privateKey = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/chain.pem', 'utf8');
/* eslint-enable */

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

app.get('/', function(reg, res){
  res.send('Hello World');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + "/puplic/index.html");
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
