// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());
// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 3000;
/* Spin up the server*/
const listening = () => console.log(`running on localhost: ${port}`);
app.listen(port, listening);

// GET route
const getData = (req, res) => {
  res.send(projectData);
};
app.get("/safe", getData);

// POST route
const postData = (req, res) => {
  let obj = {
    date: req.body.date,
    feelings: req.body.feelings,
    temp: req.body.temp,
  };
  projectData.unshift(obj);
  console.log(projectData);
};
app.post("/", postData);
