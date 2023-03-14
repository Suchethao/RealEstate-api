const mongoose = require('connection.js');
const dogpark = require('./models/DogPark.js');
const airbnb = require('../models/Airbnb.js');
const dogparkData = require('dogpark.json');
const airbnbData = require('./airbnb.json');

async function seed() {
  await airbnb.deleteMany({});
  await dogpark.deleteMany({});
  await airbnb.create(airbnbData);
  await dogpark.create(dogparkData);
  process.exit();
}

seed();
