import {assert} from 'console'
import mongoose from 'mongoose'
import DogparkSchema from '../models/DogParkSchema.js'
import Airbnb from '../models/AirbnbSchema.js' 
import Dogpark from './dogpark.json' assert { type: "json" }
import airbnbData from'./airbnb.json' assert { type: "json" }

async function seedDate() {
  await Airbnb.deleteMany({});
  await Dogpark.deleteMany({});
  await Airbnb.create(airbnbData);
  await Dogpark.create(dogparkData);
  process.exit();
}

seedDate();
