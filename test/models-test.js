var expect = require('chai').expect;
var mongoose = require('../scripts/mongooseConnect.js');
var User = require('../models/users.js');
var clearDB = require('mocha-mongoose')(require('config').get('db.connectionString'),
    {noClear: true});
var assert = require('assert');

describe('Example spec for a model', function () {

    before(function (done) {
        clearDB(done);
    });

    after(function (done) {
        clearDB(done);
    });

    it('email is not valid', function (done) {
        User.register(new User({
                username: 'String',
                email: 'not e-mail'}),
            'String', function (err, a) {
            expect(err).to.exist;
            done();
        });
    });

    it('required field', function (done) {
        User.register(new User({
                username: 'String',
                questname: 'String',
                phone: 'String'
            }),
            'String', function (err, a) {
                expect(err).to.exist;
                done();
            });
    });

    it('extra field', function (done) {
        User.register(new User({
                username: 'String',
                questname: 'String',
                phone: 'String',
                email: 'a@a.a',
                new: 'new'
            }),
            'String', function (err, a) {
                if (err) {
                    done(err);
                }
                expect(a['new']).to.equal(undefined);
                done();
            });
    });
});
