// add the express code to the scope and store it's export in a variable
const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const isProduction = process.env.MODE_ENV === "production";

// create a new instance of the express object and store it
const app = express();

// this middleware is used to handle CORS permissions. It allows the client and the api to avoid CORS issues
// first it is made available to the scope and stored in a variable
const cors = require("cors");
// then the express instance stored in the app variable is instructe to incorporate cors
app.use(cors());

// this middleware is used to decode the body of put and post etc requests for us so we can see their contents in js
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("open", function (ref) {
  console.log("MongoDB connected");
  // instruct the server to open port 3000 and react to any request that arrive there
  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
});

// ROUTING ----------------------------------------------------------------

// this endpoint is if someone visits the root address (http://localhost:3000)
app.get("/", (req, res) => {
  console.log(`${req.method} request received...`);
  res.send("Hello");
});

// this middleware uses the express router to handle all requests to the articles section of the api
// the router is required into the scope and added to the middleware as the callback for that route, and all the endpoints in that particular router will handle any further url segments such as id etc
const articles = require("./routes/articles.js");
app.use("/articles", articles);

// ERRORS ----------------------------------------------------------------
// any request or response errors will be handled and displayed here

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});
