# Web Form

This sauce shows how to create a web form to allow a non-TrackVia user to add records to TrackVia. This example uses the Handlebars templating engine [http://handlebarsjs.com/](http://handlebarsjs.com/) via the handlebars NPM package [https://www.npmjs.com/package/handlebars](https://www.npmjs.com/package/handlebars) to create the web form. Though not used in this example you could use Handlebars to customize the form based on query parameters or other data that is dynamically generated.


## Setup
To use this sauce edit the constants in the [index.js](https://github.com/Trackvia/Sauces/blob/master/web_form/index.js) file to align with your account's setup. You'll need to put in your API user key, username, password, and the numeric viewID of the view where record from the non-TrackVia user should go.

In the [template/template.hbs](https://github.com/Trackvia/Sauces/blob/master/web_form/templates/template.hbs) change the input fields names to match those of your record. For example if you have a field name "First Name" then you'll want to use that as the `name` attribute in your `<input>` elements. For example
```
<input type="text" name="First Name"></h1>
```

To install this, compress everything into a .zip file and upload as an integration in TrackVia [https://go.trackvia.com/#/integrations](https://go.trackvia.com/#/integrations). When you save the integration it'll create a URL to invoke that integraion directly. The url will look like `https://go.trackvia.com/openapi/integrations/7/invoke` where 7 will be replaced by the numeric ID of your integration.

To render the web form load that URL in a browser, be sure to add your user key and a valid access token. For example:
```
https://go.trackvia.com/openapi/integrations/7/invoke?user_key=123456&access_token=123456789ABCDEF
```

The access tokens that are currently used by TrackVia will expire after a few minutes, so for this to be useful as more than a proof of concept contact support@trackiva.com and ask for a long life access token.
