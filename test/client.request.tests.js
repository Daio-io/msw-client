var expect = require('chai').expect;
var nock = require('nock');

var MswClient = require('../index');

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
            .reply(200, [
                {mockData: 'mocked'},
                {moreMockData: 'mocked'}
            ]);

        Client.request(function (err, response) {

            expect(err).to.not.exist;
            expect(response).to.be.an('Array');
            for (var i = 0; i < response.length; i++) {

                expect(response[i]).to.be.an('Object');

            }

            done();

        });

    });

    it('should return an error if invalid field is set', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        Client.addField('invalid_field');

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

    it('should return an error if data returned is not JSON', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        Client.addField('invalid_field');

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(200, 'this_is_not_json');

        Client.request(function (err, response) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Failed to Parse JSON response');

            done();

        });

    });


});