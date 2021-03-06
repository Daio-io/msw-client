'use strict';
const expect = require('chai').expect;
const nock = require('nock');

const MswClient = require('../index');

describe('MSW Client Fields', function () {

    describe('Constructor Fields', function () {

        it('should be able to optionally set fields on client construction', function () {

            let fieldsArray = ['field1', 'field2', 'field3'];

            let NewClient = new MswClient(
                {
                    apikey: 'apikey',
                    spot_id: 1,
                    fields: fieldsArray

                });

            expect(NewClient.getRequestEndpoint()).
                to.eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&fields=field1,field2,field3');

            expect(NewClient.getFields()).to.eql(fieldsArray);

        });
    });


    describe('Add and Remove Fields', function () {

        let Client;

        beforeEach(function (done) {

            Client = new MswClient({apikey: 'apikey', spot_id: 1});
            done();

        });

        it('should be able add individual fields', function () {
            

            let newField = 'im_a_field';

            Client.addField(newField);

            let fields = Client.getFields();

            expect(fields).to.include(newField);

        });

        it('should not add the same field twice', function () {

            let newField = 'im_a_field';

            Client.addField(newField);
            Client.addField(newField);

            let fields = Client.getFields();

            expect(fields).to.include(newField);


        });

        it('should be able to remove individual fields', function () {

            let fieldToRemove = 'im_a_field';

            Client.addField(fieldToRemove);

            expect(Client.getFields()).to.contain(fieldToRemove);

            Client.removeField(fieldToRemove);

            expect(Client.getFields()).to.not.include(fieldToRemove);

        });

        it('should not remove fields if field is not set', function () {

            let field = 'im_a_field';
            let notField = 'im_not_set';

            Client.addField(field);

            expect(Client.getFields()).to.include(field);

            expect(Client.getFields()).to.not.include(notField);

            Client.removeField('im_not_set');

            expect(Client.getFields()).to.not.include(notField);
            expect(Client.getFields()).to.include(field);

        });

        it('should be able to remove all fields', function () {

            let fieldsArray = ['field1', 'field2', 'field3'];

            Client.addFields(fieldsArray);

            expect(Client.getFields()).to.eql(fieldsArray);

            Client.removeAllFields();

            expect(Client.getFields()).to.be.empty;

        });

        it('should only accept a string when adding field', function () {

            expect(function () { Client.addField(['array', 'of', 'fields']) })
                .to.throw(Error);

            expect(function () { Client.addField(2) })
                .to.throw(Error);

            expect(function () { Client.addField( {field: 'object'} ) })
                .to.throw(Error);

            expect(function () { Client.addField('fields') })
                .to.not.throw(Error);

        });


        it('should only take an array when setting fields with addFields function)', function () {

            expect(function () {

                Client.addFields('field');

            }).to.throw(Error);

            expect(function () {

                Client.addFields({fields: 'field'});

            }).to.throw(Error);

            expect(function () {

                Client.addFields(5);

            }).to.throw(Error);

            expect(function () {

                Client.addFields(['field1', 'field2']);

            }).to.not.throw(Error);


        });

    });

    describe('Endpoint with Fields', function () {

        let Client;

        beforeEach(function (done) {

            Client = new MswClient({apikey: 'apikey', spot_id: 1});
            done();

        });

        it('should update the request endpoint with the set fields', function () {

            let newField = 'im_a_field';
            let newField2 = 'im_a_field_too';

            Client.addField(newField);
            Client.addField(newField2);

            expect(Client.getRequestEndpoint())
                .to
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&fields=' + newField + ',' + newField2);


        });
        
        it('should update the request endpoint if fields are removed', function () {

            let newField = 'im_a_field';
            let newField2 = 'im_a_field_too';

            Client.addField(newField);
            Client.addField(newField2);

            expect(Client.getRequestEndpoint())
                .to
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&fields=' + newField + ',' + newField2);
            
            Client.removeField(newField);

            expect(Client.getRequestEndpoint())
                .to
                .eql('http://magicseaweed.com/api/apikey/forecast?spot_id=1&fields=' + newField2);

        });


    });


});