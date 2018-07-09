const https = require('https');

function getPM10Data() {
	https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=100&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM10&refine.land=Nordrhein-Westfalen', (resp) => {
		let data = '';
		
		resp.on('data', (chunk) => {
			data +=chunk;
		});
		
		resp.on('end', () => {
			return data;
		});
	}).on('error',()=>{
			console.log(JSON.parse(data).explanation);
	});
}


function getPM25Data() {
	https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=100&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM2.5&refine.land=Nordrhein-Westfalen', (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		
		resp.on('end', () => {
			return data;
		});
	}).on('error', () => {
		console.log(JSON.parse(data).explanation);
	});
}

var pm25Data = JSON.parse(getPM25Data);
var pm10Data = JSON.parse(getPM10Data);

console.log("PM2.5: " + pm25Data.records.length);
console.log("PM10: " + pm10Data.records.length);

