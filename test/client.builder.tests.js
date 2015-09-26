var expect = require('chai').expect;

var MswClient = require('../index');

describe('MSW Client Builder', function () {

    it('should self from setter methods', function () {

        var client = MswClient({apikey: 'key', spot_id: 1});

        expect(client.setSpotId(2)).to.be.an.instanceOf(MswClient);
        expect(client.setUnits('uk')).to.be.an.instanceOf(MswClient);
        expect(client.addField('field')).to.be.an.instanceOf(MswClient);
        expect(client.addFields(['fields'])).to.be.an.instanceOf(MswClient);

    });

});