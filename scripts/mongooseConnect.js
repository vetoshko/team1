var mongoose = require('mongoose');
var dbURI = require('config').get('db.connectionString');
mongoose.connect(dbURI);
module.exports = mongoose;
