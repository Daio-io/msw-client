var expect = require('chai').expect;

var MswClient = require('../index');

describe('MSW Client Constructor', function () {


    it('should throw an error if API key and Spot Id is not provided', function () {

        expect(function () {
            new MswClient({neither: ''})
        }).to.throw(Error);

        expect(function () {
            new MswClient({apikey: '', nospot: ''})
        }).to.throw(Error);

        expect(function () {
            new MswClient({spot_id: '', nokey: ''})
        }).to.throw(Error);

    });

    it('should return new client if created without new', function () {

        var client = MswClient({apikey: 'key', spot_id: 1});

        expect(client).to.be.an.instanceOf(MswClient);

    });

});