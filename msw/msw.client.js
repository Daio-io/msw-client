'use strict';

var request = require('request');

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