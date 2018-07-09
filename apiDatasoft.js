const https = require('https');
const NodeCouchDb = require('node-couchdb');
const fs = require('fs');

var couch = new NodeCouchDb({
	host:'www.wasdabyx.de',
	protocol:'http',
	port:5984
});

https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=1000&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.land=Nordrhein-Westfalen&timezone=Europe%2FBerlin', (resp) => {
	let data = '';

	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		var apiData = JSON.parse(data);
		console.log(apiData.records.length);
		apiData.records.forEach(function(element){
			console.log("element");
			var valueType = element.fields.value_type;
			if(valueType == "PM10"){
				couch.insert("api_opendatasoft", {
					timestamp: element.fields.timestamp,
					pm10: element.fields.value,
					long: element.fields.location[0],
					lat: element.fields.location[1]
				}).then(({data, headers, status}) => {
				}, err => {
				});
			} else if(valueType == "PM2.5"){
                                couch.insert("api_opendatasoft", {
                                        timestamp: element.fields.timestamp,
                                        pm25: element.fields.value,
                                        long: element.fields.location[0],
                                        lat: element.fields.location[1]
                                }).then(({data, headers, status}) => {
                                }, err => {
                                });
			}
		});
	console.log("successfull");
	});
}).on('error',() =>{
	console.log(JSON.parse(data).explanation);
});
