var expect = require('chai').expect;

var MswClient = require('../index');

describe('MSW Client Spot Id', function () {

    var Client;

    beforeEach(function (done) {

        Client = new MswClient({apikey: 'apikey', spot_id: 1});
        done();

    });

    it('should be able to update spot Id', function () {

        expect(Client.getSpotId()).to.eql(1);
        Client.setSpotId(4);
        expect(Client.getSpotId()).to.eql(4);

    });

    it('should only allow a number as a spot id', function () {

        expect(function () {

            new MswClient({apikey: 'key', spot_id: 'invalid'})

        }).to.throw(Error);

        expect(function () {

            Client.setSpotId('not a number');

        }).to.throw(Error);

        expect(function () {

            Client.setSpotId(['array', 'not number']);

        }).to.throw(Error);

        expect(function () {

            Client.setSpotId({not: 'number'});

        }).to.throw(Error);

        expect(function () {

            Client.setSpotId(3);

        }).to.not.throw(Error);


    });

    it('should update request endpoint if spot_id changes', function () {

        expect(Client.getRequestEndpoint()).to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1');

        Client.setSpotId(4);

        expect(Client.getRequestEndpoint()).to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=4');

    });


});