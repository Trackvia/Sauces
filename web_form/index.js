var fs = require('fs');
var TrackviaAPI = require('trackvia-api');
var pdf = require('html-pdf');
var Handlebars = require('handlebars');
var globalCallback = null;



/*********************************************
 * Configuation specific to this account
 * 
 * The data below is used to configure this example
 * to work for your specific account.
 * The only other thing that would need to be edited
 * is the template file in templates/template.hbs.
 **********************************************/
// The API key that gives you access to the API
// This is found at https://go.trackvia.com/#/my-info
const API_KEY = '12345';

// The name of the user to login as
const USERNAME = 'user@trackvia.com';

// The password of the user to login as
const PASSWORD = 'correcthorsebatterystaple';

// The address of the server you'll be using
const PRODUCTION_SERVER = 'https://go.trackvia.com';

// The numeric ID of the view to pull the data from
// You can find this in the URL of your view
// https://go.trackvia.com/#/apps/1/tables/2/views/3
const VIEW_ID = 3;


/*********************************************
 * Everything below here should only be edited
 * if substantial changes to the data structure
 * or behavior of the web form is needed.
 ********************************************/






// The TrackVia api for interaction with the data
var api = new TrackviaAPI(API_KEY, PRODUCTION_SERVER);

/**
 * Entry point into the micro service. This is where the
 * execution is kicked off
 */
exports.handler = function(event, context, callback) {
    console.log('---  starting  ---');
    globalCallback = callback;
    console.log(event);
    context.callbackWaitsForEmptyEventLoop = false;

    
    // Is any data submitted? If so save it to TrackVia and
    // return the success message.
    // Otherwise, return the web form to collect data
    if(event.data){
        //create a record
        createRecord(event.data);
    } else {
        //collect data with a web format
        generateWebForm();
    }
}


/**
 * Used to create a record based on the data
 * from the web form
 * @param {object} data 
 */
function createRecord(data){
    //create a new instance of the TrackVia API
    var api = new TrackviaAPI(API_KEY, PRODUCTION_SERVER);
    //Login to TrackVia
    api.login(USERNAME, PASSWORD)
    .then(() => {
        //now that we're loged in do some logging
        console.log('Logged In.');
        console.log("About to create record with");
        console.log(data);
        //create the record on the given view
        return api.addRecord(VIEW_ID, data);
    })
    .then((data) => {
        //yay it worked
        console.log('created record');
        console.log(data);
        //if the call back is defined
        //call back and way we're done
        if(globalCallback){
                globalCallback(null, "Created record");
            }

        return;
    })
    .catch(function(err) {
        //something went wrong
        if(globalCallback){
            globalCallback(err, null);
        }
    });
}

/**
 * Create the web form
 */
function generateWebForm(){
    //read in the template file
    fs.readFile('./templates/template.hbs', 'utf-8', function(err, hbsFile) {
        // if there's an error log it and leave
        if (err) { 
            console.log(err);
            if(globalCallback){
                globalCallback(err, null);
            }
            return;
        }
        // no error so compile the template
        var template = Handlebars.compile(hbsFile);
        var html = template({});
        //set the conent-type to text/html
        var response = {"content-type": "text/html", "payload": html};
        //we're done so call back and give the response
        if(globalCallback){
            globalCallback(null, response);
        }
    });
}
