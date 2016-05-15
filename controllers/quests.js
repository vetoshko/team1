var questsModel = require('../models/quests.js');
var Quest = questsModel.Quest;
var uploadPhoto = require('../scripts/uploadPhoto.js');

module.exports.getListPage = function (req, res) {
    res.render('quests/quests', {});
};

module.exports.list = function (req, res) {
    QuestModel.find({})
        .populate('author', 'username')
        .exec(function (err, quests) {
            if (err) {
                console.log(err);
            } else {
                res.json({quests});
            }
        });
};

module.exports.get = function (req, res) {
    res.render('quest/quest', {quest: req.params.questId});
};

module.exports.getInfo = function (req, res) {
    var questId = req.params.questId;
    Quest.findById(questId)
        .exec((err, quest) => {
            if (err) {
                return res.status(500).send();
            }
            if (!quest) {
                return res.status(400).send();
            }
            res.json({quest});
        });
};

module.exports.edit = function (req, res) {
    var questId = req.params.questId;
    Quest.update({
            _id: questId
        },
        {
            $set: {
                name: req.body.name,
                city: req.body.city,
                description: req.body.description
            }
        },
        (err, updated) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(updated.n ? 200 : 400).send();
        }
    );
};

module.exports.delete = function (req, res) {
    var questId = req.params.questId;
    Quest.remove(
        {_id: questId},
        (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.status(200).send();
        }
    );
};

module.exports.addPhoto = function (req, res) {
    var questId = req.params.questId;
    uploadPhoto.upload(req.body.newPhoto, function (err, link) {
        uploadPhoto.createPhoto(link, function (err, newPhoto) {
            Quest.findByIdAndUpdate(questId,
                {
                    $push: {
                        photo: newPhoto
                    }
                },
                (err, updated) => {
                    if (err) {
                        return res.status(500).send();
                    }
                    res.status(updated.n ? 200 : 400).send();
                });
        });
    });
};

module.exports.deletePhoto = function (req, res) {
    var questId = req.params.questId;
    var photoId = req.params.photoId;
    Quest.findByIdAndUpdate(questId,
        {
            $pull: {
                photo: {
                    _id: photoId
                }
            }
        },
        (err, updated) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(updated.n ? 200 : 400).send();
        });
};
