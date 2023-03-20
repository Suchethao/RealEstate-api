
import express from "express";
import Airbnb from "./models/AirbnbSchema.js";
import DogPark from "./models/DogParkSchema.js";
import mongoose from "mongoose";
const app = express();
const router = express.Router();


app.use(express.json());

//GET all airBnb

app.get('/', async (req, res) =>{
    return res.redirect('/airbnb')
    // return res.json({ message: "Hello, World ✌️" });
})
app.get('/airbnb', async(req, res) => {
    let allAirbnb = await Airbnb.find({})
    res.json(allAirbnb)

})

//Example 1: 
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

//
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


mongoose.connect(
    "mongodb://localhost:27017/realestate"
);

app.listen(3000, () => {
    console.log('running on port 3000')
})

//API DOCS

/**
* @api {GET} /airbnb/ Get all airbnbs
* @apiName GetAirbnbs
* @apiGroup Airbnbs

* @apiSuccess {String} _id airbnb id
* @apiSuccess {String} name airbnb name
* @apiSuccess {String} host_name Airbnb host name
* @apiSuccess {String} neighbourhood_group Airbnb borough
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} room_type Airbnb room type
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimum_nights Airbnb minimum nights
* @apiSuccess {Number} __v Airbnb v
* @apiSuccessExample Successful Response:

* [
 * {
        "_id": "6418cea32802a14b7e9127b6",
        "name": "Clean & quiet apt home by the park",
        "host_name": "John",
        "neighbourhood_group": "Brooklyn",
        "neighbourhood": "Kensington",
        "room_type": "Private room",
        "price": 149,
        "minimum_nights": 1,
        "__v": 0
 *      },
 *  ...
 * ]                   
*/

/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiParam {String} _id airbnb id

* @apiSuccess {String} _id airbnb id
* @apiSuccess {String} name airbnb name
* @apiSuccess {String} host_name airbnb host name
* @apiSuccess {String} neighbourhood_group airbnb neighborhood group
* @apiSuccess {String} neighbourhood airbnb neighbourhood
* @apiSuccess {String} room_type airbnb roomType
* @apiSuccess {Number} price airbnb price
* @apiSuccess {Number} minimum_nights Airbnb minimum nights
* @apiSuccess {Number} __v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb

* @apiSuccessExample Successful Response:
 * [
 *{
    "_id": "6418cea32802a14b7e9127b6",
    "name": "Clean & quiet apt home by the park",
    "host_name": "John",
    "neighbourhood_group": "Brooklyn",
    "neighbourhood": "Kensington",
    "room_type": "Private room",
    "price": 149,
    "minimum_nights": 1,
    "__v": 0,
    "dogParks": [
        {
            "_id": "6418cea82802a14b7e92a5bb",
            "Name": "Henry Hudson Park Off-Leash Area",
            "neighbourhood": "Brooklyn",
            "Address": "Kappock Street and Independence Avenue",
            "DogRuns_Type": "Off-Leash",
            "Accessible": "N",
            "__v": 0
        },
    ]          
}]       
*/
/**
@api {GET} /airbnb/:name/:name Get airbnb by it's name
* @apiName GetAirbnbByName
* @apiGroup Airbnbs

 * @apiParam {String} name Name of the Airbnb

* @apiSuccess {String} _id airbnb id
* @apiSuccess {String} name airbnb name
* @apiSuccess {String} host_name airbnb host name
* @apiSuccess {String} neighbourhood_group airbnb neighborhood group
* @apiSuccess {String} neighbourhood airbnb neighbourhood
* @apiSuccess {String} room_type airbnb roomType
* @apiSuccess {Number} price airbnb price
* @apiSuccess {Number} minimum_nights Airbnb minimum nights
* @apiSuccess {Number} __v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
    {
        "_id": "6418cea32802a14b7e9127b6",
        "name": "Clean & quiet apt home by the park",
        "host_name": "John",
        "neighbourhood_group": "Brooklyn",
        "neighbourhood": "Kensington",
        "room_type": "Private room",
        "price": 149,
        "minimum_nights": 1,
        "__v": 0,
        "dogParks": [
            {
                "_id": "6418cea82802a14b7e92a5bb",
                "Name": "Henry Hudson Park Off-Leash Area",
                "neighbourhood": "Brooklyn",
                "Address": "Kappock Street and Independence Avenue",
                "DogRuns_Type": "Off-Leash",
                "Accessible": "N",
                "__v": 0
            },
 *  ...
 * ]                   
*/

/**
@api {get} /dogparks Get all dog parks
* @apiName GetDogparks
* @apiGroup Dogparks

* @apiSuccess {String} _id dogparks id
* @apiSuccess {String} Name dogparks name
* @apiSuccess {String} neighbourhood dogparks neighbourhood
* @apiSuccess {String} address dogparks address
* @apiSuccess {String} DogRuns_Type dogparks type
* @apiSuccess {Number} Accessible dogparks wheelchair_accessibility
* @apiSuccess {Number} __v dogparks v
* @apiSuccessExample Successful Response:
 * [
   {
        "_id": "6418cea82802a14b7e92a5bd",
        "Name": "Joseph Rodham Drake Park Off-Leash Area",
        "neighbourhood": "Manhattan",
        "Address": null,
        "DogRuns_Type": "Off-Leash",
        "Accessible": "N",
        "__v": 0
    },
 *  ...
 * ]                   
*/