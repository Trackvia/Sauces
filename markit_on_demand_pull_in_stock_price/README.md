# Markit On Demand - Pull in stock price

This sauce will pull the current price of a stock symbol found in a field in a TrackVia record using the [markit on demand api](http://dev.markitondemand.com/MODApis/) and put it back into record in a field of your choosing.


You'll need to update the following constants:
```javaScript
const API_KEY = '12345';
const USERNAME = 'demo@trackvia.com';
const PASSWORD = 'Test1234';
const TICKER_SYMBOL_FIELD = 'Ticker Symbol';
const PRICE_FIELD = 'Price';
const VIEW_ID = '3';
```
