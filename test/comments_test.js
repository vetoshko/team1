'use strict';

const app = require('../app.js');
const CommentsController = require('../controllers/comments/comments').CommentsController;
const chai = require('chai');
const should = chai.should();
const Comment = require('../models/quests').Comment;
const eventEmitter = require('events').EventEmitter;
const http_mocks = require('node-mocks-http');


class FakeCommentsProvider {
    constructor() {
        this.quests = [{
            comments: [
                new Comment({text: '1'}),
                new Comment({text: '2'})]
        },
            {
                comments: [
                    new Comment({text: '3'}),
                    new Comment({text: '4'}),
                    new Comment({text: '5'})
                ]
            }];
    }

    getQuestById(questId, callback) {
        callback(null, this.quests[questId]);
    }

    create(questId, comment, callback) {
        if (questId >= this.quests.length) {
            return callback(null, null);
        }
        this.quests[questId].comments.push(comment);
        callback(null, this.quests[questId]);
    }

    delete(questId, commentId, user, callback) {
        if (questId >= this.quests.length) {
            return callback(null, null);
        }
        this.quests[questId].comments.splice(commentId, 1);
        callback(null, this.quests[questId]);
    }

    edit(questId, commentId, text, user, callback) {
        if (questId >= this.quests.length || commentId >= this.quests[questId].comments.length) {
            return callback(null, {n: null});
        }
        this.quests[questId].comments[commentId] = new Comment({text});
        callback(null, {n: 1});
    }
}

function buildResponse() {
    return http_mocks.createResponse({eventEmitter: eventEmitter});
}


describe('CommentsController', function () {
    beforeEach(() => {
        this.commentsProvider = new FakeCommentsProvider();
        this.controller = new CommentsController(this.commentsProvider);
    });

    it('should show comments list by quest id', (done) => {
        var response = buildResponse();
        var questId = 0;
        var request = http_mocks.createRequest({
            method: 'GET',
            url: `/quests/${questId}/comments`,
            params: {questId}
        });

        response.on('end', function () {
            response._isJSON().should.be.true;
            var data = JSON.parse(response._getData());
            should.not.exist(data.error);
            data.comments.length.should.eql(2);
            data.comments[0].text.should.eql('1');
            data.comments[1].text.should.eql('2');
            done();
        });
        this.controller.list(request, response);
    });
    it('should send badrequest if quest isnt exist', (done) => {
        var response = buildResponse();
        var questId = 2;
        var request = http_mocks.createRequest({
            method: 'GET',
            url: `/quests/${questId}/comments`,
            params: {questId}
        });

        response.on('end', function () {
            response.statusCode.should.be.eql(400);
            done();
        });
        this.controller.list(request, response);
    });
    it('should create new comment', (done) => {
        var response = buildResponse();
        var questId = 0;
        var request = http_mocks.createRequest({
            method: 'POST',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {text: 'test'}
        });
        var provider = this.commentsProvider;
        response.on('end', function () {
            response._isJSON().should.be.true;
            response.statusCode.should.be.eql(201);
            var data = JSON.parse(response._getData());
            should.not.exist(data.error);
            data.comment.text.should.eql('test');
            provider.quests[questId].comments[2].text.should.be.eql('test');
            done();
        });
        this.controller.create(request, response);
    });
    it('should send badrequest if the comment is added to a non-existent quest', (done) => {
        var response = buildResponse();
        var questId = 4;
        var request = http_mocks.createRequest({
            method: 'POST',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {text: 'test'}
        });

        response.on('end', function () {
            response.statusCode.should.be.eql(400);
            done();
        });
        this.controller.create(request, response);
    });

    it('should delete comment by id', (done) => {
        var response = buildResponse();
        var questId = 0;
        var request = http_mocks.createRequest({
            method: 'DELETE',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {commentId: 1}
        });
        var provider = this.commentsProvider;
        response.on('end', function () {
            response.statusCode.should.be.eql(200);
            provider.quests[questId].comments.length.should.be.eql(1);
            done();
        });
        this.controller.delete(request, response);
    });
    it('should not delete comment if quest with questId is not exist', (done) => {
        var response = buildResponse();
        var questId = 3;
        var request = http_mocks.createRequest({
            method: 'DELETE',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {commentId: 1}
        });
        response.on('end', function () {
            response.statusCode.should.be.eql(400);
            done();
        });
        this.controller.delete(request, response);
    });
    it('should edit comment', (done) => {
        var response = buildResponse();
        var questId = 0;
        var commentId = 0;
        var request = http_mocks.createRequest({
            method: 'PUT',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {commentId, text: 'test'}
        });
        var provider = this.commentsProvider;
        response.on('end', function () {
            response.statusCode.should.be.eql(200);
            provider.quests[questId].comments[commentId].text.should.be.eql('test');
            done();
        });
        this.controller.edit(request, response);
    });
    it('should not edit comment if wrong questId', (done) => {
        var response = buildResponse();
        var questId = 3;
        var commentId = 0;
        var request = http_mocks.createRequest({
            method: 'PUT',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {commentId, text: 'test'}
        });
        response.on('end', function () {
            response.statusCode.should.be.eql(400);
            done();
        });
        this.controller.edit(request, response);
    });
    it('should not edit comment if wrong commentId', (done) => {
        var response = buildResponse();
        var questId = 3;
        var commentId = 0;
        var request = http_mocks.createRequest({
            method: 'PUT',
            url: `/quests/${questId}/comments`,
            params: {questId},
            body: {commentId, text: 'test'}
        });
        response.on('end', function () {
            response.statusCode.should.be.eql(400);
            done();
        });
        this.controller.edit(request, response);
    });
});
