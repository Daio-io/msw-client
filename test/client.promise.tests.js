var expect = require('chai').expect;
var nock = require('nock');
var Promise = require('promise');

var MswClient = require('../index');

describe('API Promise Requests', function () {

    beforeEach(function (done) {

        nock.cleanAll();
        done();
    });
    
    it('should return a promise when called via exec', function() {

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

        expect(Client.exec()).to.be.an.instanceof(Promise);


    });

    it('should reject promise if invalid API key was provided in request', function (done) {

        var Client = new MswClient({apikey: 'bad_api', spot_id: 1});

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(500);

        Client.exec().then(function(data){

            expect(data).to.be.undefined;

        }).catch(function(err){
            
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid API key or request');

        })


    });

    it('should reject promise if location is not set correctly', function (done) {

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

        Client.exec().catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Invalid parameters');

            done();

        });

    });

    it('should resolve promise to response data', function (done) {

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

        Client.addField('invalid_field');

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(200, 'this_is_not_json');

        Client.exec.catch(function (err) {

            expect(err).to.not.be.undefined;
            expect(err.status).to.eql('Error');
            expect(err.msg).to.eql('Failed to Parse JSON response');

            done();

        });

    });


});