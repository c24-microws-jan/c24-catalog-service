const index = require('./index');
const db = require('./lib/db');
const request = require('supertest');
const expect = require('expect.js');
const nock = require('nock');

nock('http://musicbrainz.org')
  .get('/ws/2/release/5cc3cb6c-af18-4317-8999-97dedee622b5?inc=artist-credits+labels+discids+recordings&fmt=json')
  .reply(200, {
    'id': '5cc3cb6c-af18-4317-8999-97dedee622b5',
    'title': 'Rammstein'
  });

nock('http://musicbrainz.org')
  .get('/ws/2/release/4cc3cb6c-af18-4317-8999-97dedee622b5?inc=artist-credits+labels+discids+recordings&fmt=json')
  .reply(200, {
    'id': '5cc3cb6c-af18-4317-8999-97dedee622b5',
    'title': 'Nirvana'
  });

nock('http://ia802607.us.archive.org')
  .get('/32/items/mbid-5cc3cb6c-af18-4317-8999-97dedee622b5/index.json')
  .reply(200, {
    'images': [{ 'image': 'http://...' }]
  });

describe('API', () => {
  before(done => {
    db.connect(() => {
      db.ProductModel.remove({}, () => {
        done();
      });
    });
  });

  after(done => {
    db.disconnect(done)
  });

  describe('GET /', () => {
    it('should return 200', done => {
      request(index)
        .get('/')
        .expect(200)
        .end(done());
    });

    describe('GET /?query=Rammstein', () => {
      beforeEach(done => {
        request(index)
          .post('/')
          .send({ remoteId: '4cc3cb6c-af18-4317-8999-97dedee622b5' })
          .end(done)
      });

      afterEach(done => {
        request(index)
          .del('/5cc3cb6c-af18-4317-8999-97dedee622b5')
          .end(done)
      });

      it('should return return empty list', done => {
        request(index)
          .get('/?query=Rammstein')
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.be.eql(0);
            done(err);
          });
      });
    });

    describe('GET /?query=Nirvana', () => {
      beforeEach(done => {
        request(index)
          .post('/')
          .send({ remoteId: '4cc3cb6c-af18-4317-8999-97dedee622b5' })
          .end(done)
      });

      afterEach(done => {
        request(index)
          .del('/5cc3cb6c-af18-4317-8999-97dedee622b5')
          .end(done)
      });

      it('should return return matching list', done => {
        request(index)
          .get('/?query=Nirvana')
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.be.eql(1);
            done(err);
          });
      });
    });
  });

  describe('POST /', () => {
    it('should create a new product', done => {
      request(index)
        .post('/')
        .send({ remoteId: '5cc3cb6c-af18-4317-8999-97dedee622b5' })
        .expect(201)
        .end((err, res) => {
          expect(res.body.release.id).to.be.eql('5cc3cb6c-af18-4317-8999-97dedee622b5')
          expect(res.body.images.length).to.be.eql(1);
          done(err);
        });
    });

    it('not create when product already exists', done => {
      request(index)
        .post('/')
        .send({ remoteId: '5cc3cb6c-af18-4317-8999-97dedee622b5' })
        .expect(409)
        .end(done);
    });
  });
});
