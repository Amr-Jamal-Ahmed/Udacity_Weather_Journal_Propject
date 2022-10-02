// Setup empty JS object to act as endpoint for all routes
const projectData = {};
const PORT = 3001;
// require cors
const cors = require("cors");
// require bodyParser to parse request data
const bodyParser = require("body-parser");
// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

/*set up all routes*/
app.get("/allData", (req, res) => {
  res.json(projectData);
});

app.post("/allData", (req, res) => {
  projectData.temp = req.body.temp;
  projectData.content = req.body.content;
  // console.log("projectData",req.body);
  res.redirect("/");
});

// Setup Server
app.listen(PORT, (err) => {
  if (!err) console.log("server running");
  else console.log(err);
});
