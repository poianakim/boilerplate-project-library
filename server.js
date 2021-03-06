'use strict'
var compression = require('compression')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const helmet = require('helmet')
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

const apiRoutes = require('./routes/api.js')
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')

app.use(compression({ filter: shouldCompress }))
app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({ origin: '*' })) //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})
app.route('/apitest').get((req, res) => {
  res.sendFile(process.cwd() + '/views/sampleAPI.html')
})

//For FCC testing purposes
fccTestingRoutes(app)

//Routing for API
apiRoutes(app)

//404 Not Found Middleware
app.use(function (req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found')
})

//Start our server and tests!
app.listen(process.env.PORT || 3000 || '127.0.0.1:80', function () {
  console.log('Listening on port ' + process.env.PORT)
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...')
    setTimeout(function () {
      try {
        runner.run()
      } catch (e) {
        let error = e
        console.log('Tests are not valid:')
        console.log(error)
      }
    }, 1500)
  }
})

module.exports = app //for unit/functional testing
