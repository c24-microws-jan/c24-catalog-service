const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request')
const db = require('./lib/db');

// Define some default values if not set in environment
const PORT = process.env.PORT || 3000;
const SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
const SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

// Create a new express app
const app = express();

// Enable JSON body parsing
app.use(bodyParser.json());

// Add CORS headers
app.use(cors());

// Add health check endpoint
app.get(SERVICE_CHECK_HTTP, function (req, res) {
  res.json({ message: 'OK' });
});

app.get('/', (req, res) => {
  db.ProductModel.find({}, (err, products) => {
    if (err) {
      res.status(500).end();
    }

    res.status(200).send(products);
  });
});

app.post('/', (req, res) => {
  const remoteId = req.body.remoteId;

  db.ProductModel.findOne({ remoteId: remoteId }, (err, product) => {
    if (err) {
      return res.status(500).end();
    }

    if (product) {
      return res.status(409).json({ error: { message: 'Product already exists' }});
    }


    request(`http://musicbrainz.org/ws/2/release/${remoteId}?fmt=json`, (err, resp, release) => {
      if (err) {
        if (err) {
          return res.status(500).send(err);
        }
      }

      request(`http://ia802607.us.archive.org/32/items/mbid-${remoteId}/index.json`, (err, resp, images) => {
        const product = new db.ProductModel({
          remoteId: remoteId,
          release: JSON.parse(release),
          images: JSON.parse(images).images
        });

        product.save((err, product) => {
          if (err) {
            if (err) {
              return res.status(500).end();
            }
          }

          res.status(201).json(product);
        });
      });
    });
  });
});

if (!module.parent) {
  console.log(`Service listening on port ${PORT} ...`);
  const server = app.listen(PORT);
}




////////////// GRACEFUL SHUTDOWN CODE ////

const gracefulShutdown = function () {
  console.log('Received kill signal, shutting down gracefully.');

  // First we try to stop the server smoothly
  server.close(function () {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  // After SHUTDOWN_TIMEOUT we will forcefully kill the process in case it's still running
  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, SHUTDOWN_TIMEOUT);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

module.exports = app;
