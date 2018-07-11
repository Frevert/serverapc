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

Die Route um die Daten, die Raspberry kommen zu prüfen und in die CouchDb einfügen
 
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
