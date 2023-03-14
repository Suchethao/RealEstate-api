const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/realestate", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB"));

// Define routes
const airbnbRouter = require("./routes/airbnb");
app.use("/airbnb", airbnbRouter);

const dogparkRouter = require("./routes/dogpark");
app.use("/dogpark", dogparkRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
