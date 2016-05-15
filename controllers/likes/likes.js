'use strict';

class LikesController {
    constructor(likesProvider) {
        this.likesProvider = likesProvider;
    }

    likeQuest(req, res) {
        var questId = req.params.questId;
        var userId = req.user._id;
        console.log(this);
        console.log(this.likesProvider);
        this.likesProvider.likeQuest(questId, userId, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.sendStatus(201);
        });
    }

    dislikeQuest(req, res) {
        var questId = req.params.questId;
        var userId = req.user._id;
        console.log(req.user);
        this.likesProvider.dislikeQuest(questId, userId, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            console.log(updatedDoc);
            res.sendStatus(200);
        });
    }

    likePhoto(req, res) {
        var photoId = req.params.photoId;
        var userId = req.user._id;
        this.likesProvider.likePhoto(photoId, userId, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.sendStatus(201);
        });
    }

    dislikePhoto(req, res) {
        var photoId = req.params.photoId;
        var userId = req.user._id;
        this.likesProvider.dislikePhoto(photoId, userId, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.sendStatus(200);
        });
    }
}

exports.LikesController = LikesController;
