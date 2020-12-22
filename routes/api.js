'use strict';
const mongoose = require("mongoose");

const MONGODB_URI = process.env.DB
mongoose.connect(MONGODB_URI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false
  }, (err, db) => {
    if (err) {
      console.log(err);
    }
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//Building book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  writer: { type: String, required: true },
  comments: [String]
})
const Book = mongoose.model('Book', bookSchema);
module.exports = function (app) {
  app.route('/api/books')
    .get(function (req, res) {
      let responseArr = [];
      Book.find({}, (err, docs) => {
        // let responseArr = []; let bookObj = {};
        if (err) {
          console.log(err)
        } else {
          docs.forEach((doc) => {
            let bookObj = {};
            bookObj._id = doc._id;
            bookObj.title = doc.title;
            bookObj.writer = doc.writer;
            bookObj.commentcount = doc.comments.length;
            responseArr.push(bookObj);
          })
          return res.json(responseArr);
        }
      })
    })

    .post(function (req, res) {
      let title = req.body.title;
      let writer = req.body.writer;
      //response will contain new book object including atleast _id and title
      const newBook = new Book({ title: title, writer: writer })
      if (!title || !writer) {
        return res.send('Book information is missing')
      } else {
        newBook.save((err, doc) => {
          if (err) {
            console.log(err);
          } else {
            let bookObj = {};
            bookObj._id = doc._id
            bookObj.title = doc.title
            bookObj.writer = doc.writer
            return res.json(bookObj);
          }
        })
      }

    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, doc) => {
        if (err) {
          console.log(err)
        }
        if (!doc) {
          res.json('no book exists')
        } else {
          res.json(doc)
        }
      })
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      let resObj = {};
      if (!comment) {
        res.send('Comment section is required.')
      } else {
        Book.findByIdAndUpdate(bookid, {
          $push: {
            "comments": comment
          }
        }, { upsert: true, new: true }, (err, doc) => {
          if (err) {
            console.log(err)
          } else {
            res.send(doc);
          }
        })
      }

    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid }, (err, doc) => {
        if (!doc) {
          res.send('no book exists')
        }
        if (err) {
          console.log(err)
        } else {
          res.send('delete successful');
        }
      })
    });

};
