const https = require('https');
var pm25Value='';
var pm10Value='';
 
 
https.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=api-luftdateninfo&rows=100&sort=-timestamp&facet=timestamp&facet=land&facet=value_type&facet=sensor_manufacturer&facet=sensor_name&refine.value_type=PM10&refine.land=Nordrhein-Westfalen', (resp) => {
	let data = '';
	
	resp.on('data', (chunk) => {
		data +=chunk;
	});
	
	resp.on('end', () => {
		var apiData = JSON.parse(data);
		pm10Value = apiData;
		console.log(apiData.records.length);
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
		pm25Value = apiData;
		console.log("pm25:" + apiData.records.length);
	});
}).on('error', () => {
	console.log(JSON.parse(data).explanation);
});
if(pm25Value != '' && pm10Value != ''){
	console.log("Bumm");
}
