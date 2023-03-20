
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
/**
* @api {get} /airbnb/ Get all airbnbs
* @apiName GetAirbnbs
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/


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
/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/

*/
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

/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/

app.post('/airbnb', async(req, res) => {
    const airbnb = await Airbnb.create(req.body)
    res.json(airbnb)
})

/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/

app.get('/dogparks', async(req, res) =>  {
    let allDogParks = await DogPark.find({})
    res.json(allDogParks)
})

/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/
app.put('/airbnb/:id', async(req, res)=> {
    let airbnbs = await Airbnb.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
    )
    res.json(Airbnb)
})

/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/

app.delete('/houses/:id', async(req, res) => {
    let airbnb = await Airbnb.findOneAndRemove({_id: req.params.id})
    res.json(airbnb)
  })
/**
* @api {get} /airbnb/:id Get airbnb by Id
* @apiName GetAirbnb by Id
* @apiGroup Airbnbs

* @apiSuccess {String} _id Airbnb id
* @apiSuccess {String} name Airbnb name
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} neighbourhoodGroup Airbnb neighborhoodGroup
* @apiSuccess {String} neighbourhood Airbnb neighbourhood
* @apiSuccess {String} roomType Airbnb roomType
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {Number} price Airbnb price
* @apiSuccess {Number} minimumNights Airbnb minimumNights
* @apiSuccess {String} hostName Airbnb hostName
* @apiSuccess {String} v Airbnb v
* @apiSuccess {[Objects]} dogParks Array of parks objects neighboring Airbnb
* @apiSuccessExample Successful Response:
 * [
 * {
 *      "_id": "64161f12b93cd726a1e13725",
 *      "name": "Exit Glacier Trail",
 *      "area_name": "Kenai Fjords National Park",
 *      "city_name": "Seward",
 *      "state_name": "Alaska",
 *      "popularity": 17.7821,
 *      "length": 2896.812,
 *      "elevation_gain": 81.9912,
 *      "difficulty_rating": 1,
 *      "route_type": "out and back",
 *      "avg_rating": 4.5,
 *      "num_reviews": 224,
 *      "features": [
 *          "['dogs-no', 'partially-paved', 'views', 'wildlife']"
 *      ],
 *      "activities": [
 *          "['hiking', 'walking']"
 *      ],
 *      "__v": 0
 *      },
 *  ...
 * ]                   
*/

mongoose.connect(
    "mongodb://localhost:27017/realestate"
);

app.listen(3000, () => {
    console.log('running on port 3000')
})



