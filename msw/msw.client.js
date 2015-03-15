'use strict';

var request = require('request');

var MswClient = function (_config) {

    if (!(this instanceof MswClient)) {
        return new MswClient(_config);
    }

    validateSpotId(_config.spot_id);

    this.apikey = _config.apikey;
    this.spot_id = _config.spot_id;

    this.baseUrl = 'http://magicseaweed.com/api/';

};

MswClient.prototype.setSpotId = function (spotId) {
    validateSpotId(spotId);
    this.spot_id = spotId;
};

MswClient.prototype.getSpotId = function () {
    return this.spot_id;
};

MswClient.prototype.getRequestEndpoint = function () {
    return this.baseUrl + this.apikey + '/forecast?spot_id=' + this.spot_id;
};

MswClient.prototype.request = function (callback) {

    //TODO : refactor into helpers
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