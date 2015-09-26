'use strict';

// Require the MswClient: require('msw-client');
var MswClient = require('./index');

// Create a new instance with your apikey and spot_id
var msw = new MswClient({

    apikey: process.env.MSW_KEY,
    spot_id: 1449

});

// You can chain setters and fields
msw.setSpotId(1449).setUnits('uk').addField('');

// ** Making a Request ** //

// Classic Request
msw.request(function(err, response){

    console.log('Classic request: ', response);

});

// With Promises no callback provided returns promise
msw.request().then(function(data){

    console.log('Promise request: ', data);

}).catch(function(err){

    console.log(err);

});