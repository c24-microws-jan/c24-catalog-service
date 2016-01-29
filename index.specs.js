const index = require('./index');
const db = require('./lib/db');
const request = require('supertest');

describe('API', () => {

  before(done => {
    db.connect(done);
  });

  after(done => {
    db.disconnect(done)
  });

  describe('GET /', () => {
    it('should return all', done => {
      request(index)
        .get('/')
        .end((req, res) => {
          console.log(req, res.body);
          done();
        });
    });
  });

  describe('POST /', () => {
    it('should return 200', done => {
      request(index)
        .post('/')
        .send({ remoteId: '59211ea4-ffd2-4ad9-9a4e-941d3148024a'})
        .end((req, res) => {
          console.log(req, res.body);
          done();
        });
    });
  });
});
