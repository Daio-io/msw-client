[![Build Status](https://travis-ci.org/Daio-io/msw-client.svg)](https://travis-ci.org/Daio-io/msw-client)
[![Coverage Status](https://coveralls.io/repos/Daio-io/msw-client/badge.svg?branch=master&service=github)](https://coveralls.io/github/Daio-io/msw-client?branch=master)
[![Code Climate](https://codeclimate.com/github/Daio-io/msw-client/badges/gpa.svg)](https://codeclimate.com/github/Daio-io/msw-client)
[![NPM](https://img.shields.io/npm/v/msw-client.svg)](https://www.npmjs.com/package/msw-client)
[![Dependency Status](https://img.shields.io/david/Daio-io/msw-client.svg)](https://david-dm.org/Daio-io/msw-client)
[![devDependency Status](https://img.shields.io/david/dev/Daio-io/msw-client.svg)](https://david-dm.org/Daio-io/msw-client#info=devDependencies)

# msw-client

## Description

Node client library to allow easy communication with the [Magic Seaweed API](http://magicseaweed.com/developer/forecast-api)

You will Need to contact Magic Seaweed in order to [get an API key](http://magicseaweed.com/developer/sign-up).
Please make sure you read their terms first.

See [release notes](https://github.com/Daveloper87/msw-client/blob/master/RELEASE.md) for new release details.

## Usage

Available on npm. 
**NOTE: Version 2.0.0 is only supported in Node 5+. For versions lower than Node 5 use msw-client v1.4.1**

firstly you need to install into your dependencies:

    npm install msw-client --save

### Constructor, API key and SpotId

Then simply create an instance of the client:

```javascript
const MSW = require('msw-client');
const MswClient = new MSW({
    apikey: 'YOUR_API_KEY',
    spot_id: 2 // must be a number
});
```

Both apikey and spot_id are required.

spot_id indicates the spot / beach you want to get forecast data for

    spot_id: 1449 // this is rest bay

To figure out your spot_id visit the surf report for that beach on the Magic Seaweed website and look at the url:

    http://magicseaweed.com/Porthcawl-Rest-Bay-Surf-Report/1449/ - spot id is the last parameter

Once set in the constructor, the spot_id can be retrieved or updated at any point:

```javascript
MswClient.getSpotId(); // 2
MswClient.setSpotId(3); // must be a number
```

To make a request simply call:

```javascript
MswClient.request().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
});
```

These will respond with an array of objects as documented [MSW API](http://magicseaweed.com/developer/forecast-api)


### Units

As of version 1.1.0 you can now set the unit to your country region so that measurements and temperature are returned as you would expect in your region.

e.g. temperature returns as F for US requests.

There are three valid unit types: 'uk', 'us' or 'eu'.

You can set units on the constructor:

```javascript
const MSW = require('msw-client');
const MswClient = new MSW({
    apikey: 'YOUR_API_KEY',
    spot_id: 2 // must be a number
    units: 'us' // must be a string
});
```
or via the setUnits function

```javascript
MswClient.setUnits('us');
MswClient.getUnits(); // returns 'us';
```

If not set it will default to uk

```javascript
MswClient.getUnits(); // returns 'uk';
```

### Fields

You can also add fields to filter the data you want.

This can either be done via the constructor:

```javascript
const MSW = require('msw-client');
const MswClient = new MSW({
    apikey: 'YOUR_API_KEY',
    spot_id: 2,
    fields: ['timestamp', 'wind'] // must be an array
});
```

or at any point in your code via functions:

```javascript
MswClient.addField('timestamp'); // add single field by string name
MswClient.addFields(['timestamp', 'wind']); // add fields by array
```

You can also retrieve and remove fields:

```javascript
MswClient.getFields(); // ['timestamp', 'wind'] returns fields array
MswClient.removeField('timestamp'); // remove single field by string name
MswClient.removeAllFields(); // I wonder what this does...
```

A list of fields are available based on the response data. More details here: [MSW API](http://magicseaweed.com/developer/forecast-api)

Feel free to submit issues and contribute.

Surfs Up!
