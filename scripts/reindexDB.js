var mongoose = require('../scripts/mongooseConnect.js');
var Quest = require('../models/quests.js').Quest;
var clearES = require('./clearES.js');

// Переидексируем ES - удалим индекс и заидексируем каждый объект
clearES(() => {
    Quest.find({}, (err, quests) => {
        quests.forEach((quest, i) => {
            quest.index((err, res) => {
                if (err) {
                    console.log('Cant index elem', err);
                } else {
                    console.log(`Indexed ${i}`);
                }
            });
        });
    });
});
