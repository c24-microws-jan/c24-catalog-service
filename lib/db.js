const request = require('request');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

request.get('http://46.101.245.190:8500/v1/health/service/c24-catalog-service-db', (err, response, body) => {
  const data = JSON.parse(body);

  if (err || data.length === 0) {
    throw new Error('Error getting db address');
  }

  const node = data.pop();

  mongoose.connect(`mongodb://${node.Service.Address}:${node.Service.Port}/catalog`)
});

const = ProductModel = mongoose.model('Release', new Schema({
  data: Object
}));

module.export.ProductModel = ProductModel;
