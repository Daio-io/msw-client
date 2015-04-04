var expect = require('chai').expect;
var nock = require('nock');

var MswClient = require('../index');

describe('MSW Client Units', function () {

    describe('Constructor Units', function () {

        it('should be able to optionally set unit on client construction', function () {

            var unit = 'us';

            var NewClient = new MswClient(
                {
                    apikey: 'apikey',
                    spot_id: 1,
                    unit: unit

                });

            expect(NewClient.getRequestEndpoint()).
                to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&unit=' + unit);

            expect(NewClient.getUnit()).to.eql(unit);

        });
    });


    describe('get and set Units', function () {

        var Client;

        beforeEach(function (done) {

            Client = new MswClient({apikey: 'apikey', spot_id: 1});
            done();

        });

        it('should be able add set unit', function () {


            var unit = 'us';

            Client.setUnit(unit);

            var setUnit = Client.getUnit();

            expect(setUnit).to.eql(unit);

        });

        it('should only except valid units', function () {

            var validUnts = ['uk', 'us', 'uk'];

            for (var i = 0; i < validUnts.length; i++) {

                expect(function () {

                    Client.setUnit(validUnts[i])

                }).to.not.throw(Error);

            }

            var invalidUnit = 'pa';
            expect(function () {

                setUnit(invalidUnit)

            }).to.throw(Error);

        });

        it('should not allow upper case units', function () {

            var upperUnit = 'UK';
            expect(function () {

                setUnit(upperUnit)

            }).to.throw(Error);

        });

        it('should be able to change units', function () {

            var unit = 'uk';
            var unitToChangeTo = 'eu';

            Client.setUnit(unit);

            expect(Client.getUnit()).to.eql(unit);

            Client.setUnit(unitToChangeTo);

            expect(Client.getUnit()).to.eql(unitToChangeTo);

        });

        it('should default to uk if unit not set', function () {

            expect(Client.getUnit()).to.eql('uk');

        });

        it('should only take a string value as unit', function () {

            expect(function () {
                Client.setUnit(['array', 'of', 'units'])
            })
                .to.throw(Error);

            expect(function () {
                Client.setUnit(2)
            })
                .to.throw(Error);

            expect(function () {
                Client.setUnit({unit: 'object'})
            })
                .to.throw(Error);

            expect(function () {
                Client.setUnit('uk')
            })
                .to.not.throw(Error);

        });

    });

    describe('Endpoint with Units', function () {

        var Client;

        beforeEach(function (done) {

            Client = new MswClient({apikey: 'apikey', spot_id: 1});
            done();

        });

        it('should update the request endpoint with the set unit', function () {

            var unit = 'us';

            Client.setUnit(unit);

            expect(Client.getRequestEndpoint())
                .to
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&unit=' + unit);


        });

        it('should not show unit if uk is set (default)', function () {

            var unit = 'uk';

            Client.setUnit(unit);

            var endPoint = Client.getRequestEndpoint();

            expect(endPoint)
                .to
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1');

            expect(endPoint)
                .to.not
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&unit=' + unit);

        });


    });


});