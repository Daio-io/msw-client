var expect = require('chai').expect;
var nock = require('nock');

var MswClient = require('../index');

var API_KEY = '';

var mswApi = nock('http://magicseaweed.com/api')
    .get('/' + API_KEY);


describe('MSW Client', function () {


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

            var client = MswClient({apikey: 'key', spot_id: 'id'});

            expect(client).to.be.an.instanceOf(MswClient);

        });

    });

    describe('MSW Client Getters', function () {

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

        it('should be able to get request endpoint', function () {

            expect(Client.getRequestEndpoint()).to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1');

        });

        it('should update request endpoint if spot_id changes', function () {

            expect(Client.getRequestEndpoint()).to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1');
            Client.setSpotId(4);
            expect(Client.getRequestEndpoint()).to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=4');

        });

    });

    describe('MSW Client API Requests', function () {


        it('should throw and error if invalid API key was provided request', function (done) {


        });

        it('should throw and error if location is not set correctly', function (done) {


        });

        it('should be able to get data from API when call is made', function (done) {


        });


    });

});