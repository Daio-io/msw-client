'use strict';

var MswClient = function (_config) {

    if( !(this instanceof MswClient) ) {
        return new MswClient(_config);
    }

    if ( _config.apikey === undefined || _config.spot_id === undefined ){
        throw new Error('API Key and Spot ID are required config');
    }

    this.apikey = _config.apikey;
    this.spot_id = _config.spot_id;

};

MswClient.prototype.setSpotId = function (spotId) {
    this.spot_id = spotId;
};

MswClient.prototype.getSpotId = function () {
    return this.spot_id;
};

MswClient.prototype.getRequestEndpoint = function () {
    return 'http://magicseaweed.com/api/' + this.apikey + '/forecast?spot_id=' + this.spot_id;
};



module.exports = MswClient;