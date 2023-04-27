// Load environment variables from .env file
require('dotenv').config()

// Import required packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: false }));

// Log all incoming requests
app.use(function (req, res, next) {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
})

// Serve the homepage
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

// Serve static files from the public folder
app.use("/public", express.static(__dirname + "/public"));

// Return a JSON response with message
app.get("/json", (req, res) => {
    const json = { message: "Hello json" };
    json.message = process.env.MESSAGE_STYLE === "uppercase" ? json.message.toUpperCase() : json.message;
    res.json(json);
});

// Return the current time as a JSON response
app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => res.json({ time: req.time }));

// Echo back the word in the URL
app.get("/:word/echo", (req, res) => res.json({ echo: req.params.word }));

// Handle the "name" endpoint for GET and POST requests
app.route("/name")
    .get((req, res) => {
        res.json({ name: `${req.query.first} ${req.query.last}` });
    })
    .post((req, res) => {
        res.json({ name: `${req.body.first} ${req.body.last}` });
    })

// Export the express app
module.exports = app;
