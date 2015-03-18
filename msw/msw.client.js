'use strict';

/**
 * MswClient module.
 * @module msw.client
 */


var request = require('request');

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

    validateSpotId(_config.spot_id);

    this.apikey = _config.apikey;
    this.spot_id = _config.spot_id;
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
    validateSpotId(spotId);
    this.spot_id = spotId;
};

MswClient.prototype.getSpotId = function () {
    return this.spot_id;
};

MswClient.prototype.getRequestEndpoint = function () {
    
    var endpoint = this.requestEndpoint + this.spot_id;
    
    if (this.fields.length > 0){
        
        endpoint += '&fields=' + this.fields.join(',');
        
    }
    
    return endpoint;
};

MswClient.prototype.addField = function (fieldName) {
  
    if(typeof fieldName !== 'string'){
        throw new Error ('Field must be a string value');
    }
    if (this.fields.indexOf(fieldName) === -1) {
        this.fields.push(fieldName);
    }
    
};

MswClient.prototype.addFields = function (fieldsArray) {
    if ( !Array.isArray(fieldsArray) ) {
        throw new Error('Using addFields should be an Array. ' +
            'You can add string fields using addField()');
    }
    
    var fieldsLength = fieldsArray.length;
    
    for (var i = 0; i < fieldsLength; i++){
        
        this.addField(fieldsArray[i]);
        
    }
    
};

MswClient.prototype.removeField = function (fieldName) {

    var fieldIndex = this.fields.indexOf(fieldName);
    
    if (fieldIndex !== -1){
        this.fields.splice(fieldIndex, 1);
    }

};


MswClient.prototype.removeAllFields = function () {

    this.fields = [];

};

MswClient.prototype.getFields = function () {

    return this.fields;

};

MswClient.prototype.request = function (callback) {

    var url = this.getRequestEndpoint();

    request.get(url, function (err, response, body) {

        if (response.statusCode === 500) {

            var error = {
                status: 'Error',
                msg: 'Invalid API key or request'
            };

            callback(error);

        } else {

            try {
                var data = JSON.parse(body);

                if (data.error_response) {
                    callback({status: 'Error', msg: 'Invalid parameters'});
                    return;
                }
            }
            catch (err) {

                callback({status: 'Error', msg: 'Failed to Parse JSON response'});
                return;
            }

            callback(null, data);
        }

    })
};


/**
 * @private
 * @param spot_id
 */
function validateSpotId(spot_id) {
    if (typeof spot_id !== 'number') {
        throw new Error('Spot Id should be an integer value');
    }
}


module.exports = MswClient;