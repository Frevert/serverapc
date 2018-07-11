'use strict';
var https = require('https');
var pm25Value = '';
var pm10Value = '';
var NodeCouchDb = require('node-couchdb');
var date = require('date-and-time');

date.locale('de');

var couch = new NodeCouchDb({
  host: 'www.wasdabyx.de',
  protocol: 'http',
  port: 5984,
});

/* eslint-disable */
https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=500&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM10&refine.land=Nordrhein-Westfalen', (resp) => {
/* eslint-enable */
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
          /* eslint-disable */
          if (pm25Value.records[j].fields.timestamp === pm10Value.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] === pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] === pm10Value.records[i].fields.location[1]) {
          /* eslint-enable */
            couch.insert('api_opendatasoft', {
              timestamp: pm25Value.records[j].fields.timestamp,
              pm10: pm10Value.records[i].fields.value,
              pm25: pm25Value.records[j].fields.value,
              long: pm25Value.records[j].fields.location[1],
              lat: pm25Value.records[j].fields.location[0],
            }).then(({data, headers, status}) => {
            }, err => {
              console.log();
            });
            counter++;
          }
        }
      }
      /* eslint-disable */
      console.log('Succesfull! Wrote ' + counter + ' data to api_opendatasoft on ' + datum);
      /* eslint-enable */
    }
  });
}).on('error', () => {
  console.log('Fehler');
});
/* eslint-disable */
https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=500&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM2.5&refine.land=Nordrhein-Westfalen', (resp) => {
/* eslint-enable */
  let data = '';
  var datum = date.format(new Date(), 'DD.MM.YY');

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    var apiData = JSON.parse(data);
    var counter = 0;
    pm25Value = apiData;
    if (pm10Value !== ''){
      for (var i = 0; i < pm10Value.records.length; i++){
        for (var j = 0; j < pm25Value.records.length; j++){
          /* eslint-disable */
          if (pm25Value.records[j].fields.timestamp === pm10Value.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] === pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] === pm10Value.records[i].fields.location[1]){
          /* eslint-enable */
            couch.insert('api_opendatasoft', {
              timestamp: pm25Value.records[j].fields.timestamp,
              pm10: pm10Value.records[i].fields.value,
              pm25: pm25Value.records[j].fields.value,
              long: pm25Value.records[j].fields.location[1],
              lat: pm25Value.records[j].fields.location[0],
            }).then(({data, headers, status}) => {
            }, (err) => {
              console.log();
            });
            counter++;
          }
        }
      }
      /* eslint-disable */
      console.log('Succesfull! Wrote ' + counter + ' data to api_opendatasoft ' + datum);
      /* eslint-enable */
    }
  });
}).on('error', () => {
  console.log('Fehler');
});
