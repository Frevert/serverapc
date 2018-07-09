const https = require('https');
var pm25Value='';
var pm10Value='';
const NodeCouchDb = require('node-couchdb');
 
var couch = new NodeCouchDb({
	host:'www.wasdabyx.de',
	protocol:'http',
	port:5984
});
 
https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=100&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM10&refine.land=Nordrhein-Westfalen', (resp) => {
	let data = '';
	
	resp.on('data', (chunk) => {
		data +=chunk;
	});
	
	resp.on('end', () => {
		var apiData = JSON.parse(data);
		var myArray = [];
		pm10Value = apiData;
		if(pm25Value != ''){
			for(var i = 0;i<pm10Value.records.length;i++){
				for(var j=0; j<pm25Value.records.length; j++){
					if(pm25Value.records[j].fields.timestamp == pm10Value.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] == pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] == pm10Value.records[i].fields.location[1]){
						couch.insert("api_exampleapi",{
							timestamp: pm25Value.records[j].fields.timestamp,
							pm10: pm10Value.records[i].fields.value,
							pm25: pm25Value.records[j].fields.value,
							long: pm25Value.records[j].fields.location[0],
							lat: pm25Value.records[j].fields.location[1]
						}).then(({data, headers, status}) => {
						}, err => {
						});
					}
				}
			}
		}
	});
}).on('error',()=>{
		console.log(JSON.parse(data).explanation);
});

https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=100&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM2.5&refine.land=Nordrhein-Westfalen', (resp) => {
	let data = '';
	resp.on('data', (chunk) => {
		data += chunk;
	});
	
	resp.on('end', () => {
		var apiData = JSON.parse(data);
		var myArray = [];
		pm25Value = apiData;
		if(pm10Value != ''){
			for(var i = 0; i<pm10Value.records.length; i++){
				for(var j=0; j<pm25Value.records.length; j++){
					if(pm25Value.records[j].fields.timestamp == pm10Value.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] == pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] == pm10Value.records[i].fields.location[1]){
						couch.insert("api_exampleapi",{
							timestamp: pm25Value.records[j].fields.timestamp,
							pm10: pm10Value.records[i].fields.value,
							pm25: pm25Value.records[j].fields.value,
							long: pm25Value.records[j].fields.location[0],
							lat: pm25Value.records[j].fields.location[1]
						}).then(({data, headers, status}) => {
						}, err => {
						});
					}
				}
			}
		}
	});
}).on('error', () => {
	console.log(JSON.parse(data).explanation);
});
