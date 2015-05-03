var expect = require('chai').expect;
var mswMock = require('./mocking/endpoint.mock');
var Promise = require('promise');
var MswClient = require('../index');

describe('API Promise Requests', function () {

    beforeEach(function (done) {

        mswMock.cleanUp();
        done();

    });
    
    it('should return a promise when called via exec', function() {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockGoodResponse();

        expect(Client.exec()).to.be.an.instanceof(Promise);


    });

    it('should reject promise if invalid API key was provided in request', function (done) {

        var Client = new MswClient({apikey: 'bad_api', spot_id: 1});

        mswMock.mockInvalidApiKey();

        Client.exec().then(function(data){

            expect(data).to.be.undefined;

        }).catch(function(err){
            
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid API key or request');

            done();
        })


    });

    it('should reject promise if location is not set correctly', function (done) {

        var invalidSpotId = 23892739872398263;

        var Client = new MswClient({apikey: 'apikey', spot_id: invalidSpotId});

        mswMock.mockInvalidParameters();

        Client.exec().catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid parameters');

            done();

        });

    });

    it('should resolve promise to response data', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockGoodResponse();

        Client.exec().then(function (data) {

            expect(data).to.be.an('Array');
            for (var i = 0; i < data.length; i++) {

                expect(data[i]).to.be.an('Object');

            }

            done();

        });

    });

    it('should reject promise if data returned is not JSON', function (done) {

        var Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockNotJson();

        Client.exec().catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Failed to Parse JSON response');

            done();

        });

    });


});