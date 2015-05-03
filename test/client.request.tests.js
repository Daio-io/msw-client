var expect = require('chai').expect;
var mswMock = require('./mocking/endpoint.mock');
var MswClient = require('../index');

describe('API Requests', function () {

    beforeEach(function (done) {

        mswMock.cleanUp();
        done();
    });

    it('should return an error if invalid API key was provided in request', function (done) {

        var Client = new MswClient({apikey: 'bad_api', spot_id: 1});

        mswMock.mockInvalidApiKey();

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

        mswMock.mockInvalidParameters();

        Client.request(function (err, response) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid parameters');

            done();

        });

    });

    it('should be able to get data from API when call is made', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockGoodResponse();

        Client.request(function (err, response) {

            expect(err).to.not.exist;
            expect(response).to.be.an('Array');
            for (var i = 0; i < response.length; i++) {

                expect(response[i]).to.be.an('Object');

            }

            done();

        });

    });

    it('should return an empty array if invalid field is set', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        Client.addField('invalid_field');

        mswMock.mockEmptyResponse();

        Client.request(function (err, response) {

            expect(err).to.be.null;
            expect(response).to.be.empty;

            done();

        });

    });

    it('should return an error if data returned is not JSON', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        Client.addField('invalid_field');

        mswMock.mockNotJson();

        Client.request(function (err, response) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Failed to Parse JSON response');

            done();

        });

    });


});