import mongoose from '../db/connection.js'
import airbnb from './Airbnb.js'

// Define the schema for houses, including the subdocument for characters
const dogparkSchema = new mongoose.Schema({
    Name: String,
    neighbourhood: String,
    Address: String,
    DogRuns_Type: String,
    Accessible: String,
    // "Notes": null,
    // "": ""
    })

export default mongoose.model('dogpark', dogparkSchema)