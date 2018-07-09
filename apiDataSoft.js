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
		if(pm25Value != ''){
			for(var i = 0;i<pm10Value.records.length;i++){
				for(var j=j<pm25Value.records.length;j++){
					if(pm25Value.records[j].fields.timestamp == pm10.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] == pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] == pm10Value.records[i].fields.location[1]){
						console.log("gefunden");
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
		pm25Value = apiData;
		console.log("pm25:" + apiData.records.length);
		if(pm10Value != ''){
			for(var i = 0;i<pm10Value.records.length;i++){
				for(var j=j<pm25Value.records.length;j++){
					if(pm25Value.records[j].fields.timestamp == pm10.records[i].fields.timestamp && pm25Value.records[j].fields.location[0] == pm10Value.records[i].fields.location[0] && pm25Value.records[j].fields.location[1] == pm10Value.records[i].fields.location[1]){
						console.log("gefunden");
					}
				}
			}
		}
	});
}).on('error', () => {
	console.log(JSON.parse(data).explanation);
});
