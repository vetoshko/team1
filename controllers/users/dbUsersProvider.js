'use strict';

var User = require('../../models/users');

class DbUsersProvider {
    editUserById(userId, newUserData, callback) {
        User.findByIdAndUpdate(userId,
            {
                $set: {
                    email: newUserData.email,
                    phone: newUserData.phone,
                    username: newUserData.username
                }
            },
            callback);
    }

    getUserById(userId, callback) {
        User.findById(userId, callback);
    }
}


exports.DbUsersProvider = DbUsersProvider;
