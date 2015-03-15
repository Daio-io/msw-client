'use strict';

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