'use strict';

var rimraf = require('rimraf');

module.exports.delete = (path) => {
    rimraf(path, (err) => {
        if (err) {
            console.log('Ошибка при удалении файла');
        };
    });
};
