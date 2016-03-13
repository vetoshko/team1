var dbURI = 'mongodb://team1-urfu2015:team1-urfu2015@ds011429.mlab.com:11429/team1-urfu2015';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../models/users.js');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});
var assert = require('assert');

describe('Example spec for a model', function () {
    before(function (done) {
        if (mongoose.connection.db) {
            return done();
        }
        mongoose.connect(dbURI, done);
    });

    before(function (done) {
        clearDB(done);
    });

    it('email is not valid', function (done) {
        new User(
            {
                nickname: 'String',
                questname: 'String',
                email: 'not e-mail',
                password: 'String',
                phone: 'String'
            }).save(function (err, a) {
            expect(err).to.exist;
            done();
        });
    });

    it('required field', function (done) {
        new User(
            {
                questname: 'String',
                email: 'a@a.a',
                password: 'String',
                phone: 'String'
            }).save(function (err, a) {
            expect(err).to.exist;
            done();
        });
    });

    it('extra field', function (done) {
        new User(
            {
                nickname: 'String',
                questname: 'String',
                email: 'a@a.a',
                password: 'String',
                phone: 'String',
                new: 'new'
            }).save(function (err, a) {
            expect(a['new']).to.equal(undefined);
            done();
        });
    });
});
