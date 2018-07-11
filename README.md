[![Build Status](https://travis-ci.com/Frevert/serverapc.svg?branch=master)](https://travis-ci.com/Frevert/serverapc)

# AP - serverapi
Repository for project 'Air Pollution Control' (Server part)

## Modul for project AirPollutionControl at FH-Bielefeld

View full Project an Concept at our Main and Documentation Repository [here](https://github.com/sweigel1/RichClientApplicationDevelopment).

## License

This Project is published under the MIT - License.
View full License [here](https://github.com/ghaake/apc-pouchdb/blob/master/LICENSE)


## Source Code

### ServerRouting

Die Route, um die Daten, die vom Raspberry kommen zu prüfen und in die CouchDb einzufügen
 
```javascript
app.put('/', function(req, res){
  if (req.body.id == null) {
    res.status(404).send('Missing id');
  } else {
    /* eslint-disable */
    couch.get('all_sensors', 'sensor_' + req.body.id).then(({data, headers, status}) => {
    /* eslint-enable */
      var config = data;
      res.sendStatus(200);
      req.body.data.forEach((data) => {
        if(config.userId !== undefined){
          checkEmailNotification(data, config);
        }
        couch2.insert('sensor_' + req.body.id, {
          timestamp: data.timestamp,
          temperature: data.temperature,
          humidity: data.humidity,
          pm10: data.pm10,
          pm25: data.pm25,
          long: data.long,
          lat: data.lat,
        }).then(({data, headers, status}) => {

        }, err => {
          console.log(err);
        });
      });
    }, err => {
      res.status(404).send(err.EDOCMISSING);
    });
  }
});
```

Die Route, um die config für die Sensoren an den Raspberry zu schicken

```javascript
app.get('/config', function(req, res){
  /* eslint-disable */
  couch.get('all_sensors', 'sensor_' + req.param('id')).then(({data, headers, status}) => {
    var responseJson = '{"id": \"' + data.config.identifier + '\", "url":"http://www.wasdabyx.de:8080","interval":' + data.config.interval + ', "long": ' + data.config.long + ', "lat": ' + data.config.lat + '}';
    /* eslint-enable */
    console.log(responseJson);
    res.send(responseJson);
  }, err => {
    console.log(err.message);
    res.send(err.message);
  });
});
```

### Email Check

```javascript
function checkEmailNotification(weatherData, config){
  var userIds = config.userId;
  userIds.forEach((userId) => {
    couch.get('all_users', userId).then(({data, headers, status}) => {
      if (data.emailnotification){
        checkWeatherData(weatherData, config.config, data.email, config.config.identifier);
      }
    }, err => {
      console.log(err.message);
    });
  });
}

function checkWeatherData(weatherData, config, emailAddress, sensorId) {
  if (weatherData.temperature >= config.temperature_limit){
    sendMail.MailSenden(emailAddress, 'Temperature is over ' + config.temperature_limit, sensorId);
  }
  if (weatherData.humidity >= config.humidity_limit){
    sendMail.MailSenden(emailAddress, 'Humidity is over ' + config.humidity_limit, sensorId);
  }
  if (weatherData.pm25 >= config.pm25_limit){
    sendMail.MailSenden(emailAddress, 'Value of pm2.5 is over ' + config.pm25_limit, sensorId);
  }
  if (weatherData.pm10 >= config.pm10_limit){
    sendMail.MailSenden(emailAddress, 'Value of pm 10 is over ' + config.pm10_limit, sensorId);
  }
}
```

### HTTPS Certificate

```javascript
const privateKey = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/wasdabyx.de/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

app.get('/login', function(req, res){
  res.sendFile(__dirname + "/puplic/index.html");
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
```

### Api request

```javascript
https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=500&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM10&refine.land=Nordrhein-Westfalen', (resp) => {
  let data = '';
  var datum = date.format(new Date(), 'DD.MM.YY');
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    var apiData = JSON.parse(data);
    var counter = 0;
    pm10Value = apiData;
    if (pm25Value !== '') {
      for (var i = 0; i < pm10Value.records.length; i++) {
        for (var j = 0; j < pm25Value.records.length; j++) {
          if (pm25Value.records[j].fields.timestamp === pm10Value.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] === pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] === pm10Value.records[i].fields.location[1]) {
            couch.insert('api_opendatasoft', {
              timestamp: pm25Value.records[j].fields.timestamp,
              pm10: pm10Value.records[i].fields.value,
              pm25: pm25Value.records[j].fields.value,
              long: pm25Value.records[j].fields.location[1],
              lat: pm25Value.records[j].fields.location[0],
            }).then(({data, headers, status}) => {
            }, ({err}) => {
              console.log();
            });
            counter++;
          }
        }
      }
      console.log('Succesfull! Wrote ' + counter + ' data to api_opendatasoft on ' + datum);
    }
  });
})
```