'use strict';

/**
 * MswClient module.
 * @module MswClient
 */

var got = require('got');
var MswPromise = require('promise');

/**
 * @description List of valid countries that can be used for data units responses
 * @type {string[]}
 */
var validUnits = ['uk', 'us', 'eu'];

/**
 * Magic Seaweed Client Object
 * @namespace MswClient
 * @constructor
 * @param {Object} _config - configuration object needed to instantiate client
 *
 * @description The MswClient allows easy communication with the Magic Seaweed API.
 * Configuration apikey and spot_id are required on creation. Optional fields can also
 * be passed in with the configuration if required.
 *
 * @example
 * // Create new instance of MswClient
 * var MSW = require('msw-client');
 * var MswClient = new MSW({
 *     apikey: 'YOUR_API_KEY',
 *     spot_id: 2, // must be a number
 *     fields: ['timestamp', 'wind'] // Optional array of fields
 * });
 *
 */
var MswClient = function (_config) {

    if (!(this instanceof MswClient)) {
        return new MswClient(_config);
    }

    var units = _config.units || 'uk';

    this.apikey = _config.apikey;
    this.setSpotId(_config.spot_id);
    this.setUnits(units);
    this.fields = _config.fields || [];
    this.baseUrl = 'http://magicseaweed.com/api/';
    this.requestEndpoint = this.baseUrl + this.apikey + '/forecast?spot_id=';

};

/**
 * Change the spot id for requests
 * @memberOf MswClient
 * @instance
 * @method setSpotId
 * @param {number} spotId - Id number of spot / beach location
 *
 * @description MswClient uses a spotId to provide data for that spot / beach location on
 * successful request. This method allows you to update the spotId so the location
 * can be changed at any point during runtime.
 * To find your spot_id visit the surf report for that beach on the Magic Seaweed website and look at the url:
 * http://magicseaweed.com/Porthcawl-Rest-Bay-Surf-Report/1449/ - spot id is the last parameter
 *
 * @example
 * // In your code set a new spot id
 * MswClient.setSpotId(5); //  change spot id to location 5
 *
 */
MswClient.prototype.setSpotId = function (spotId) {
    if (typeof spotId !== 'number') {
        throw new Error('Spot Id should be an integer value');
    }

    this.spot_id = spotId;
};

/**
 * Get the currently set spot id for requests
 * @memberOf MswClient
 * @instance
 * @method getSpotId
 * @returns {number} spotId - Id number of spot / beach location.
 *
 * @description MswClient uses a spotId to provide data for that spot / beach location on
 * successful request. This method allows you to get the current spot id for requests.
 *
 * @example
 * // In your code get spot id
 * MswClient.getSpotId(); //  return value
 *
 */
MswClient.prototype.getSpotId = function () {
    return this.spot_id;
};


/**
 * Set units for requests
 * @memberOf MswClient
 * @instance
 * @method setUnits
 * @param {string} units - Unit country code - 'uk', 'us' or 'eu'
 *
 * @description MswClient uses a units value to change the measurements and temperature.
 * i.e. us will have F instead of C for temperature.
 * You can set the units to one of these valid values: 'uk', 'us' or 'eu'. This defaults to 'uk' if not set.
 *
 * @example
 * // In your code set a new spot id
 * MswClient.setUnits('us'); //  set Unit to us e.g. temperature will be F
 *
 */
MswClient.prototype.setUnits = function (units) {
    if (typeof units !== 'string' || validUnits.indexOf(units) === -1) {
        throw new Error('Unit should be a lowercase String value and one of these valid' +
            'units: ' + validUnits);
    }

    this.units = units;
};

/**
 * Get the currently set spot id for requests
 * @memberOf MswClient
 * @instance
 * @method getUnits
 * @returns {String} units - Currently set country units
 *
 * @description MswClient uses a units value to change the measurements and temperature.
 * i.e. us will have F instead of C for temperature. This method returns
 * the currently set units. The default value is 'uk' if not set.
 *
 * @example
 * // In your code get the set units
 * MswClient.getUnits(); //  returns value 'uk'
 *
 * MswClient.setUnits('us');
 *
 * MswClient.getUnits(); //  returns value 'us'
 *
 */
MswClient.prototype.getUnits = function () {
    return this.units;
};

/**
 * Get the full request endpoint
 * @memberOf MswClient
 * @instance
 * @method getRequestEndpoint
 * @returns {string} requestEndpoint - The full URL endpoint (including any filters) for current requests.
 *
 * @description Method to return the full constructed URL endpoint, including any set parameters and fields,
 * for the Magic Seaweed API.
 *
 * @example
 * // In your code get request endpoint
 * MswClient.getRequestEndpoint(); //  return string URL
 *
 */
MswClient.prototype.getRequestEndpoint = function () {

    var endpoint = this.requestEndpoint + this.spot_id + this._getUnitQueryString();

    if (this.fields.length > 0) {

        endpoint += '&fields=' + this.fields.join(',');

    }

    return endpoint;
};

/**
 * Create a string for the units endpoint query
 * @memberOf MswClient
 * @private
 * @method _getUnitQueryString
 * @returns {string} unitQueryString - The query param for a valid units
 *
 * @description Helper function to attach the units to query params on request.
 *
 */
MswClient.prototype._getUnitQueryString = function () {

    if (this.units === 'uk') {
        return '';
    }

    return '&units=' + this.units;

};

/**
 * Adds a field to filter data from MSW
 * @memberOf MswClient
 * @instance
 * @method addField
 * @param {string} fieldName - Field name to be set for requests
 *
 * @description MswClient allows use of fields to filter data returned from Magic Seaweed API to only include
 * data from those fields. This method allows you to add single fields to your requests.
 * If you try to add an existing field it will not duplicate.
 *
 * @example
 * // In your code add a field
 * MswClient.addField('timestamp');
 * MswClient.addField('wind');
 *
 * // All proceeding requests will only include data from these fields.
 *
 */
MswClient.prototype.addField = function (fieldName) {

    if (typeof fieldName !== 'string') {
        throw new Error('Field must be a string value');
    }
    if (this.fields.indexOf(fieldName) === -1) {
        this.fields.push(fieldName);
    }

};

/**
 * Adds a field to filter data from MSW
 * @memberOf MswClient
 * @instance
 * @method addFields
 * @param {Array} fieldsArray - String Array of field names to be set for requests
 *
 * @description MswClient allows use of fields to filter data returned from Magic Seaweed API to only include
 * data from those fields. This method allows you to add multiple fields to your requests.
 * If you try to add an existing field it will not duplicate.
 *
 * @example
 * // In your code add fields
 * MswClient.addFields(['timestamp', 'wind']);
 *
 * // All proceeding requests will only include data from these fields.
 *
 */
MswClient.prototype.addFields = function (fieldsArray) {
    if (!Array.isArray(fieldsArray)) {
        throw new Error('Using addFields should be an Array. ' +
            'You can add string fields using addField()');
    }

    var fieldsLength = fieldsArray.length;

    for (var i = 0; i < fieldsLength; i++) {

        this.addField(fieldsArray[i]);

    }

};

/**
 * Get all currently set fields
 * @memberOf MswClient
 * @instance
 * @method getFields
 * @returns {Array} - String Array of all fields currently set (Empty if no fields set).
 *
 * @description MswClient allows use of fields to filter data returned from Magic Seaweed API to only include
 * data from those fields. This method allows you to get a list of fields set.
 *
 * @example
 * // In your code get fields
 * MswClient.getFields(); // returns ['timestamp', 'wind'];
 *
 */
MswClient.prototype.getFields = function () {

    return this.fields;

};

/**
 * Removes the specified field
 * @memberOf MswClient
 * @instance
 * @method removeField
 * @param {string} fieldName - Field name to be removed
 *
 * @description MswClient allows use of fields to filter data returned from Magic Seaweed API to only include
 * data from those fields. This method allows you to remove single fields from your requests.
 * If you try to remove a field that does not it exist, it will be ignored.
 *
 * @example
 * // In your code remove a field
 * MswClient.removeField('timestamp');
 *
 * // All proceeding requests will no longer include this field.
 *
 */
MswClient.prototype.removeField = function (fieldName) {

    var fieldIndex = this.fields.indexOf(fieldName);

    if (fieldIndex !== -1) {
        this.fields.splice(fieldIndex, 1);
    }

};

/**
 * Removes all set fields
 * @memberOf MswClient
 * @instance
 * @method removeFields
 *
 * @description MswClient allows use of fields to filter data returned from Magic Seaweed API to only include
 * data from those fields. This method allows you to remove all fields set.
 *
 * @example
 * // In your code remove fields
 * MswClient.removeFields();
 *
 * // All proceeding requests will no longer include any fields.
 *
 */
MswClient.prototype.removeAllFields = function () {

    this.fields = [];

};

/**
 * Makes a request to the Magic Seaweed API
 * @memberOf MswClient
 * @instance
 * @method request
 * @param {function} callback - Callback function which takes an error and data parameter. callback(err, data);
 *
 * @description Allows you to make a request to return data from the Magic Seaweed API.
 *
 * @example
 * // In your code to make a request
 * MswClient.request( function (err, data) {
 *
 *      if (err) {
 *          console.log(err); // {status: 'Error', msg: 'Error message here'}
 *          console.log(data); // undefined
 *      }
 *
 *      console.log(err); // undefined if no error
 *      console.log(data); // This will return Array of Objects as per Magic Seaweed response Documentation
 *
 * });
 *
 */
MswClient.prototype.request = function (callback, endpoint) {

    var url = endpoint || this.getRequestEndpoint();

    got.get(url, function (error, body, response) {

        var statusCode = response.statusCode;

        if (statusCode === 500) {

            callback({status: 'Error', msg: 'Invalid API key or request'});

        } else {

            try {
                var data = JSON.parse(body);

                if (data.error_response) {

                    callback({status: 'Error', msg: 'Invalid parameters'});
                    return;
                }

                callback(null, data);

            } catch (err) {

                callback({status: 'Error', msg: 'Failed to Parse JSON response'});

            }

        }

    });
};

MswClient.prototype.exec = function () {

    var request = this.request;
    var url = this.getRequestEndpoint();
    
    return new MswPromise(function (resolve, reject) {

        request(function(err, data){

            if(err){

                reject(err);

            } else {

                resolve(data);

            }

        }, url);

    });

};

module.exports = MswClient;