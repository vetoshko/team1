const request = require('supertest');
const app = require('../app.js');
const User = require('../models/users.js');
const chai = require('chai');
const expect = chai.expect;
const nodemailer = require('nodemailer');

var message;

function mockNodeMailer() {
    nodemailer.createTransport = () => {
        return {
            sendMail: (options, callback) => {
                message = options.html;
                callback(null, {response: 'FAKE 200 OK'});
            }
        };
    };
}

function checkVerification(done) {
    expect(message).to.exist;
    var url = message.match(/href=".*(\/verify\/.*?)">/)[1];
    request(app)
        .get(url)
        .expect(302)
        .expect('Location', '/')
        .end((err) => {
            expect(err).to.not.exist;
            User.findOne({
                username: 'typicalUser'
            }, (err, user) => {
                expect(err).to.not.exist;
                expect(user).to.exist;
                expect(user.createdAt).to.not.exist;
                done();
            });
        });
}

describe('Auth tests', () => {
    before((done) => {
        mockNodeMailer();
        User.remove(done);
    });

    after((done) => {
        User.remove(done);
    });

    it('should sign up new user', (done) => {
        request(app)
            .post('/signup')
            .send({
                email: 'typical@email.com',
                username: 'typicalUser',
                password: 'typicalPassword'
            })
            .expect(302)
            .expect('Location', '/')
            .end((err) => {
                expect(err).to.not.exist;
                User.findOne({
                    username: 'typicalUser'
                }, (err, user) => {
                    expect(err).to.not.exist;
                    expect(user).to.exist;
                    expect(user.createdAt).to.exist;

                    checkVerification(done);
                });
            });
    });

    it('should not sign up existing user', (done) => {
        request(app)
            .post('/signup')
            .send({
                email: 'typical@email.com',
                username: 'typicalUser',
                password: 'typicalPassword'
            })
            .expect(302)
            .expect('Location', '/signup', done);
    });

    it('should not sign up user with incorrect email', (done) => {
        request(app)
            .post('/signup')
            .send({
                email: 'bademail.com',
                username: 'typicalUser2',
                password: 'typicalPassword'
            })
            .expect(302)
            .expect('Location', '/signup', done);
    });

    it('should sign in normal user', (done) => {
        request(app)
            .post('/signin')
            .send({
                username: 'typicalUser',
                password: 'typicalPassword'
            })
            .expect(302)
            .expect('Location', '/')
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.headers[`set-cookie`]).to.exist;
                done();
            });
    });

    it('should not sign in nonexistent user', (done) => {
        request(app)
            .post('/signin')
            .send({
                username: 'typicalUnexistingUser',
                password: 'typicalPassword'
            })
            .expect(401, done);
    });

    it('should not sign in user with incorrect password', (done) => {
        request(app)
            .post('/signin')
            .send({
                username: 'typicalUser',
                password: 'typicalWrongPassword'
            })
            .expect(401, done);
    });
});
