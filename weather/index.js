var weather = require('weather-js');
var cities = require('cities');
var TrackviaAPI = require('trackvia-api');

const API_KEY = '12345';
const USERNAME = 'demo@trackvia.com';
const PASSWORD = 'Test1234';
const VIEW_ID=1111;
var tv = new TrackviaAPI(API_KEY, 'https://go.trackvia.com');


exports.handler = function(event, context, callback) {
    console.log('--------------   Start   --------------');
    context.callbackWaitsForEmptyEventLoop = false;
    tv.login(USERNAME,PASSWORD)
    .then(() => {
        console.log("Logged In");
        if ( event.recordId != null ) {
            return tv.getRecord(VIEW_ID, event.recordId);
        }
        else {
            // example Honolulu, HI  
            var obj = { 'data' : { 'Location' : { 'latitude' : '21.306944', 'longitude' : '-157.858333'} }} ;
            return obj;
        }
    })
    .then((record) => {
        console.log("Setting Location Info");
        console.log(record);
        // fetch the latitude and longitude from a field named "Location"
        var lat = record['data']['Location']['latitude'];
        var lng = record['data']['Location']['longitude'];

        console.log("Looking up " + lat + " : " + lng);
        var resp = cities.gps_lookup(lat,lng);
        console.log(resp);
        var weatherPromise = new Promise((resolve, reject) => {
            weather.find({search: resp.city + ", " + resp.state_abbr, degreeType: 'F'}, function(err, result) {
                if(err) { 
                    console.log(err) 
                    reject(err);
                } 
                else {
                    console.log("Found weather report");
                    console.log(result);
                    if ( event.recordId != null ) {
                        console.log("Updating weather report");
                        // update the record in TrackVia setting the fields
                        // below
                        tv.updateRecord(VIEW_ID, event.recordId, {
                            "Temperature" : result[0]['current']['temperature'],
                            "Feels Like" : result[0]['current']['feelslike'],
                            "Tomorrow's High" : result[0]['forecast'][0]['high'],
                            "Tomorrow's Low" : result[0]['forecast'][0]['low']
                        }).
                        then((record) => {
                            resolve(record);  
                        });
                    }
                    else {
                        resolve(result);
                    }
                }
            });
        });

        return weatherPromise;
     })
     .then((weatherResponse) => {
        console.log('--------------   End   --------------');
        callback(null, weatherResponse);
     })
    .catch((err) => {
        console.log(err);
        callback(err, null);
    });
};
       
