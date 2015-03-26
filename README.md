[![Build Status](https://travis-ci.org/Daveloper87/msw-client.svg)](https://travis-ci.org/Daveloper87/msw-client)
[![Coverage Status](https://coveralls.io/repos/Daveloper87/msw-client/badge.svg)](https://coveralls.io/r/Daveloper87/msw-client)
[![Code Climate](https://codeclimate.com/github/Daveloper87/msw-client/badges/gpa.svg)](https://codeclimate.com/github/Daveloper87/msw-client)
[![NPM](https://img.shields.io/npm/v/msw-client.svg)](https://www.npmjs.com/package/msw-client)
[![Dependency Status](https://img.shields.io/david/Daveloper87/msw-client.svg)](https://david-dm.org/daveloper87/msw-client)
[![devDependency Status](https://img.shields.io/david/dev/Daveloper87/msw-client.svg)](https://david-dm.org/daveloper87/msw-client#info=devDependencies)

# msw-client

## Description

Node client library to allow easy communication with the [Magic Seaweed API](http://magicseaweed.com/developer/forecast-api)

You will Need to contact Magic Seaweed in order to [get an API key](http://magicseaweed.com/developer/sign-up).
Please make sure you read their terms first.

## Usage

Available on npm.

firstly you need to install into your dependencies:

    npm install msw-client --save

Then simply create an instance of the client:

```javascript
var MSW = require('msw-client');
var MswClient = new MSW({
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
MswClient.request(function (err, response) {
    console.log(response);
});
```

The response will be an array of objects as documented [MSW API](http://magicseaweed.com/developer/forecast-api)

You can also add fields to filter the data you want.

This can either be done via the constructor:

```javascript
var MSW = require('msw-client');
var MswClient = new MSW({
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

## TODO

This project is in active development and will be updated. (No breaking changes planned).

- Event Emitters 

Surfs Up!




