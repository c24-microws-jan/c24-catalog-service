'use strict';
const request = require('request');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let connection;

function connect(cb) {
  if (process.env.MONGODB) {
    connection = mongoose.connect(process.env.MONGODB);

    return cb();
  }

  request.get('http://46.101.245.190:8500/v1/health/service/c24-catalog-service-db', (err, response, body) => {
    const data = JSON.parse(body);

    if (err || data.length === 0) {
      throw new Error('Error getting db address');
    }

    const node = data.pop();

    connection = mongoose.connect(`mongodb://${node.Service.Address}:${node.Service.Port}/catalog`, cb);
  });
}

function disconnect(cb) {
  connection.disconnect(cb);
}

const ProductModel = mongoose.model('Product', new Schema({
  remoteId: String,
  release: Object,
  images: Array
}));

module.exports.ProductModel = ProductModel;
module.exports.connect = connect;
module.exports.disconnect = disconnect;
