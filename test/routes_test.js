const request = require('supertest');
const app = require('../app.js');

describe('Router tests', () => {
    it('return something at /', (done) => {
        request(app)
            .get('/')
            .expect(200, done);
    });
    it('return 404 at bad url', (done) => {
        request(app)
            .get('/not_exist')
            .expect(404, done);
    });
});
