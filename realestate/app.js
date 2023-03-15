
import express from "express";
import Airbnb from "./models/AirbnbSchema.js";
import DogPark from "./models/DogParkSchema.js";
const app = express();
const router = express.Router();

app.use(express.json());

app.get('/', async (req, res) =>{
    res.redirect('/airbnb')
})
app.get('/airbnb', async(req, res) => {
    let allAirbnb = await Airbnb.find({})
    res.json(allAirbnb)

})
app.get('/airbnb/:id', async(req, res) => {
    console.log(req.params)
    let airbnbById = await Airbnb.findById(req.params.id)
    console.log(airbnbById)
    res.json(airbnbById)
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
app.listen(3000, () => {
    console.log('running on port 3000')
})


