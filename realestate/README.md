##Airbnb and Dogpark API
This is an Express.js API that demonstrates fetching Airbnb and Dogpark data from a MongoDB database using Mongoose.

##Requirements
Node.js
MongoDB
Installation
Clone the repository.
Install dependencies with npm install.
Start the API with npm start.

#### Endpoints:

#### GET /airbnb
Gets all Airbnb listings.

>Response
Returns an array of Airbnb listings, each containing the following properties:

_id: Airbnb ID
name: Airbnb name
host_name: Airbnb host name
neighbourhood_group: Airbnb borough
neighbourhood: Airbnb neighbourhood
room_type: Airbnb room type
price: Airbnb price
minimum_nights: Airbnb minimum nights
__v: Airbnb version

#### GET /airbnb/:id
Gets a specific Airbnb listing by ID and adds an array of dog parks in the same neighbourhood to the response.

>Parameters
id (required): The ID of the Airbnb listing to retrieve.

>Response
Returns an Airbnb listing with the same properties as above, plus an array of dog parks in the same neighbourhood as the Airbnb listing.

#### GET /airbnb/name/:name
Gets Airbnb listings by name and adds an array of dog parks in the same neighbourhood to the response.

>Parameters
name (required): The name of the Airbnb listing to retrieve.

>Response
Returns an array of Airbnb listings with the same properties as above, plus an array of dog parks in the same neighbourhood as each Airbnb listing.

#### POST /airbnb
>Creates a new Airbnb listing.

>Request Body
An object containing the following properties:

name: Airbnb name
host_name: Airbnb host name
neighbourhood_group: Airbnb borough
neighbourhood: Airbnb neighbourhood
room_type: Airbnb room type
price: Airbnb price
minimum_nights: Airbnb minimum nights

>Response
Returns the created Airbnb listing.

#### GET /dogparks
Gets all dog parks.

>Response
>Returns an array of dog parks, each containing the following properties:

_id: Dog park ID
name: Dog park name
neighbourhood: Dog park neighbourhood

##API Documentation
This API has documentation in API Blueprint format, which can be viewed using Aglio or another compatible tool. The documentation is located in the apiary.apib file.



