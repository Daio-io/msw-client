const expect = require('chai').expect;

const MswClient = require('../index');

describe('MSW Client Builder', function () {

    it('should self from setter methods', function () {

        const client = MswClient({apikey: 'key', spot_id: 1});

        expect(client.setSpotId(2)).to.be.an.instanceOf(MswClient);
        expect(client.setUnits('uk')).to.be.an.instanceOf(MswClient);
        expect(client.addField('field')).to.be.an.instanceOf(MswClient);
        expect(client.addFields(['fields'])).to.be.an.instanceOf(MswClient);

    });

});