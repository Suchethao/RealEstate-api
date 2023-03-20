
import express from "express";
import Airbnb from "./models/AirbnbSchema.js";
import DogPark from "./models/DogParkSchema.js";
import mongoose from "mongoose";
const app = express();
const router = express.Router();

app.use(express.json());

app.get('/', async (req, res) =>{
    return res.redirect('/airbnb')
    // return res.json({ message: "Hello, World ✌️" });
})
app.get('/airbnb', async(req, res) => {
    let allAirbnb = await Airbnb.find({})
    res.json(allAirbnb)

})
// Example1:
// use ID from Request and get the document from AirBnb collection
// Then get the location of Airbnb
// Then use the location to run a find on DogPark collection
// Add the dogPark array to the Airbnb result
app.get('/airbnb/:id', async(req, res) => {
    try {
        console.log(req.params)
        const airbnbById = await Airbnb.findById(req.params.id).lean() // lean allows to modify a Mongoose returned document, else its immutable
        const airBnbLocation = airbnbById.neighbourhood_group
        const dogParks = await DogPark.find({"neighbourhood" : airBnbLocation})
        airbnbById['dogParks'] = dogParks

        res.json(airbnbById)
    } catch(err) {
        console.log("Unexpected Error occurred", err)
        res.json(err)
    }
})
// Example 2: If filtering based on certain parameter like Name and then matching Dogpark location, we can use
// the concept of joins (MongoDB Aggregation)
app.get('/airbnb/name/:name', async(req, res) => {
    try {
        console.log(req.params.name)
        const airbnbs = await Airbnb.aggregate([
            {
                "$match": {name: req.params.name} // matches the exact name from Airbnb and passes the result to second pipeline
                // We can use regex match as well to perform a 'Like' search
            },
            {  // Use result from first stage of pipeline to lookup the Dogpark collection with conditions
                "$lookup": {
                    from: "dogparks",
                    localField: "neighbourhood_group",
                    foreignField: "neighbourhood",
                    as: "dogParks"
                }
            }
        ])
        res.json(airbnbs)
    } catch(err) {
        console.log("Unexpected Error occurred", err)
        res.json(err)
    }

})
app.post('/airbnb', async(req, res) => {
    const airbnb = await Airbnb.create(req.body)
    res.json(airbnb)
})
app.get('/dogparks', async(req, res) =>  {
    let allDogParks = await DogPark.find({})
    res.json(allDogParks)
})
// app.get("/airbnb/:id/characters", async(req, res) => {
//     const characters = await House.find({}).select('members')
//     res.json(characters)
// })

// app.get('houses/:houseId/characters/:charId', async(req, res) =>  {
//     let charactersById = await House.findById(req.params.id)
//     res.json(charactersById.members.id)
// })
// app.post("/houses/:id/characters", async(req, res) => {
//     const house = await House.findByIdAndUpdate(req.params.id)
//     const character = await Character.create(req.body)
//     house.members.push(character)
//     await house.save()
//     res.json(character)
// })
app.put('/airbnb/:id', async(req, res)=> {
    let airbnbs = await Airbnb.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
    )
    res.json(Airbnb)
})
app.delete('/houses/:id', async(req, res) => {
    let airbnb = await Airbnb.findOneAndRemove({_id: req.params.id})
    res.json(airbnb)
  })

mongoose.connect(
    "mongodb://localhost:27017/realestate"
);

app.listen(3000, () => {
    console.log('running on port 3000')
})


