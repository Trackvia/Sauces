var request = require('request');
var TrackviaAPI = require('trackvia-api');

const API_KEY = '12345';
const USERNAME = 'demo@trackvia.com';
const PASSWORD = 'Test1234';
const TICKER_SYMBOL_FIELD = 'Ticker Symbol';
const PRICE_FIELD = 'Price';
const VIEW_ID = '3';

var api = new TrackviaAPI(API_KEY, 'https://go.trackvia.com');

exports.handler = function(event, context, callback) {
    console.log('--------------   Start   --------------');
    context.callbackWaitsForEmptyEventLoop = false;




    api.login(USERNAME, PASSWORD)
        .then(() => {
            console.log('Logged In.');
            return api.getRecord(VIEW_ID, event.recordId);
        })
        .then((record) => {
            var ticker = record['data'][TICKER_SYMBOL_FIELD];

            var quotePromise = new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json',
                    qs: {
                        'symbol': ticker
                    }
                }, (err, response, body) => {
                    resolve(JSON.parse(body));
                });
            });

            return quotePromise;
        })
        .then((quoteResponse) => {
            var quotePrice = null;
            if (quoteResponse && quoteResponse['LastPrice']) {
                quotePrice = quoteResponse['LastPrice'];
            }

            console.log(`Quote Price: ${quotePrice}`);
            var priceData = {};
            priceData[PRICE_FIELD] = quotePrice;
            return api.updateRecord(VIEW_ID, event.recordId, priceData);
        })
        .then(() => {
            console.log('record updated');
            callback(null, 'success');
        })
        .catch((err) => {
            console.log(err);
            callback(err, null);
        });
};
