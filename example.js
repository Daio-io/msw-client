'use strict';

// Require the MswClient: require('msw-client');
const MswClient = require('./index');

// Create a new instance with your apikey and spot_id
const msw = new MswClient({

  apikey: process.env.MSW_KEY,
  spot_id: 1449

});

// You can chain setters and fields
msw.setSpotId(1449).setUnits('uk');

//// Request returns a promise
msw.request().then(data => {

  console.log(data);

}).catch(err => {

  console.log(err);
});