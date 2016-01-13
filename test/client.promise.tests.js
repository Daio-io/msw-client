'use strict';

const expect = require('chai').expect;
const mswMock = require('./mocking/endpoint.mock');
const MswClient = require('../index');

describe('API Promise Requests', function () {

    beforeEach(function (done) {

        mswMock.cleanUp();
        done();

    });

    it('should reject promise if invalid API key was provided in request', function (done) {

        let Client = new MswClient({apikey: 'bad_api', spot_id: 1});

        mswMock.mockInvalidApiKey();

        Client.request().then(function(data){

            expect(data).to.be.undefined;

        }).catch(function(err){
            
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid API key or request may have failed');

            done();
        })


    });

    it('should reject promise if location is not set correctly', function (done) {

        let invalidSpotId = 23892739872398263;

        let Client = new MswClient({apikey: 'apikey', spot_id: invalidSpotId});

        mswMock.mockInvalidParameters();

        Client.request().catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid parameters provided');

            done();

        });

    });

    it('should resolve promise to response data', function (done) {

        let Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockGoodResponse();

        Client.request().then(function (data) {

            expect(data).to.be.an('Array');
            for (var i = 0; i < data.length; i++) {

                expect(data[i]).to.be.an('Object');

            }

            done();

        });

    });

    it('should reject promise if data returned is not JSON', function (done) {

        let Client = new MswClient({apikey: 'apikey', spot_id: 1});

        mswMock.mockNotJson();

        Client.request().catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Failed to Parse JSON response');

            done();

        });

    });
  
    it('should return promise', function () {

      var Client = new MswClient({apikey: 'apikey', spot_id: 1});

      mswMock.mockGoodResponse();

      expect(Client.request()).to.be.an.instanceof(Promise);

    });

});