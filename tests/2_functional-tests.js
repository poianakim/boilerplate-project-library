const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       assert.property(res.body[0], 'writer', 'Books in array should contain writer');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  let nnValidId = 'notvalidid';
  let id;
  suite('Routing tests', function () {

    suite('POST /api/books with title and writer => create book object/expect book object', function () {

      test(' **DONE Test POST /api/books with title and writer', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Title', writer: 'Writer' })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.body.title, 'Title')
              assert.equal(res.body.writer, 'Writer')
              assert.equal(res.status, 200)
              id = res.body._id
            }
            done();
          })
      });

      test(' **DONE Test POST /api/books with no title and writer info given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.text, 'Book information is missing')
              assert.equal(res.status, 200)
            }
            done();
          })
      });

    });
    suite('GET /api/books => array of books', function () {
      test(' **DONE Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.isArray(res.body, 'response should be an array')
              assert.equal(res.status, 200)
            }
            done();
          })
      });
    });
    suite('GET /api/books/[id] => book object with [id]', function () {
      test(' **DONE Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('api/books/' + nnValidId)
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              res.send('no book exists')
            }
            done();
          })
      });

      test(' ** DONE Test GET /api/books/[id] with valid id in db',
        function (done) {
          chai.request(server)
            .get('api/books/' + id)
            .end((err, res) => {
              if (err) {
                console.log(err)
              } else {
                assert.equal(res.json.title, 'Title')
                assert.equal(res.json.writer, 'Writer')
                assert.equal(res.json._id, id)
                assert.equal(res.status, 200)
              }
              done();
            })
        });
    });
    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test(' **DONE Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + id)
          .send({ comment: 'Comment' })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.status, 200)
              console.log(res.body)
              assert.isObject(res.body, 'response should be an object')
              assert.equal(res.body.title, 'Title')
              assert.equal(res.body.writer, 'Writer')
              assert.equal(res.body.comments, 'Comment')
            }
            done();
          })
      });

      test(' **DONE Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + id)
          .send({ comment: '' })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'Comment section is required.')
            }
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books' + nnValidId)
          .send({ comment: 'Comment' })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.status, 404)
            }
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test(' **DONE Test DELETE /api/book2s/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + id)
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.text, 'delete successful')
              assert.equal(res.status, 200)
            }
            done();
          })
      });

      test(' **DONE Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('api/books' + nnValidId)
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'no book exists')
            }
            done();
          })
      });

    });

  });

});
