var expect = require('chai').expect;
var nock = require('nock');

var MswClient = require('../index');

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

            var client = MswClient({apikey: 'key', spot_id: 1});

            expect(client).to.be.an.instanceOf(MswClient);

        });

    });

    describe('Spot Id', function () {

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


    describe('API Requests', function () {

        beforeEach(function (done) {

            nock.cleanAll();
            done();
        });

        it('should return an error if invalid API key was provided in request', function (done) {

            var Client = new MswClient({apikey: 'bad_api', spot_id: 1});

            nock('http://magicseaweed.com')
                .filteringPath(function (path) {
                    return '/';
                })
                .get('/')
                .reply(500);

            Client.request(function (err, response) {

                expect(err).to.not.be.undefined;
                expect(response).to.be.undefined;
                expect(err.status).to.eql('Error');
                expect(err.msg).to.eql('Invalid API key or request');

                done();

            });


        });

        it('should return an error if location is not set correctly', function (done) {

            var invalidSpotId = 23892739872398263;

            var Client = new MswClient({apikey: 'apikey', spot_id: invalidSpotId});

            nock('http://magicseaweed.com')
                .filteringPath(function (path) {
                    return '/';
                })
                .get('/')
                .reply(200, {
                    error_response: {
                        code: 501,
                        error_msg: "Invalid parameters were supplied and did " +
                        "not pass our validation, please double check your request."
                    }
                });

            Client.request(function (err, response) {

                expect(err).to.not.be.undefined;
                expect(err.status).to.eql('Error');
                expect(err.msg).to.eql('Invalid parameters');

                done();

            });

        });

        it('should be able to get data from API when call is made', function (done) {

            var Client = new MswClient({apikey: 'apikey', spot_id: 1});

            nock('http://magicseaweed.com')
                .filteringPath(function (path) {
                    return '/';
                })
                .get('/')
                .reply(200, [{mockData: 'mocked'},
                    {moreMockData: 'mocked'}]);

            Client.request(function (err, response) {

                expect(err).to.not.exist;
                expect(response).to.be.an('Array');
                for (var i = 0; i < response.length; i++){

                    expect(response[i]).to.be.an('Object');

                }

                done();

            });

        });


    });

});