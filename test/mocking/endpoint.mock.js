'use strict';

var nock = require('nock');

module.exports = {

    mockNotJson: function() {
        
        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(200, 'this_is_not_json');
        
    },
    
    mockEmptyResponse: function() {

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(200, []);
        
    },
    
    mockGoodResponse: function() {


        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(200, [
                {mockData: 'mocked'},
                {moreMockData: 'mocked'}
            ]);
        
    },
    
    mockInvalidParameters: function() {

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
        
    },
    
    mockInvalidApiKey: function() {

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')
            .reply(500);

    },

    mockRequestFail: function() {

        nock('http://magicseaweed.com')
            .filteringPath(function (path) {
                return '/';
            })
            .get('/')

    },
    
    cleanUp: function() {
        
        nock.cleanAll();
        
    }

};