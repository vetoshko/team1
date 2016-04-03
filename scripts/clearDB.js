var MongoClient = require('mongodb').MongoClient;
var dbURI = require('config').get('db.connectionString');

module.exports = function (done) {
    MongoClient.connect(dbURI, (err, db) => {
        db.dropDatabase((err) => {
            console.log('Database dropped');
            db.close();
            done();
        });
    });
};
