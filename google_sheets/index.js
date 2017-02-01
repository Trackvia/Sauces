var TrackviaAPI = require('trackvia-api');
var GoogleSpreadsheet = require("google-spreadsheet");

const API_KEY = '12345';
const USERNAME = 'demo@trackvia.com';
const PASSWORD = 'Test1234';
const VIEW_ID=1111;
const SPREADSHEET_ID='1-lkjiusdfasUlalkhaadsfsvnqu'

var tv = new TrackviaAPI(API_KEY, 'https://go.trackvia.com');
var doc = new GoogleSpreadsheet(SPREADSHEET_ID);
var serialNo = "";

exports.handler = function(event, context, callback) {
    console.log('--------------   Start   --------------');
    context.callbackWaitsForEmptyEventLoop = false;
    tv.login(USERNAME,PASSWORD)
    .then(() => {
        console.log("Logged In");
        return tv.getRecord(VIEW_ID, event.recordId);
    })
    .then((record) => {
        //console.log(record);
        // get a value from the record data
        serialNo = record['data']['Serial Number'];

        console.log("Fetching Machines");
        // loop through the first 10 rows looking for a matching serial no
	    doc.getRows(1, { 'offset': 1, 'limit': 10, }, function(err, rows) {
            rows.forEach(function(row) {a
                // note that "serialno" is the column name in the spreadsheet
                // column names are first row in the spreadsheet
                if ( row.serialno == serialNo ) {
                    console.log("Found serial no match " + serialNo);

                    // update values in trackvia from data in spreadsheet
                    return tv.updateRecord(VIEW_ID, event.recordId, {
                        'Last Service Date' : row.lastservicedate,
                        'Next Service Date' : row.nextservicedate,
                        'Service Summary' : row.servicesummary
                    });
                }
            });
            
        });
    }) 
    .then(() => {
        console.log('record updated');
        console.log('--------------   End   --------------');
        callback(null, 'success');
     })
    .catch((err) => {
        console.log(err);
        callback(err, null);
    });
};
