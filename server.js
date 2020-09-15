// add the express code to the scope and store it's export in a variable
const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");

const isProduction = false;

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
  useFindAndModify: false,
});
mongoose.connection.on("open", function (ref) {
  console.log("MongoDB connected");
  // instruct the server to open port 3000 and react to any request that arrive there
  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
});

// ROUTING ----------------------------------------------------------------

app.use(morgan("dev"));

// this endpoint is if someone visits the root address (http://localhost:3000)
app.get("/", (req, res) => {
  console.log(`${req.method} request received...`);
  res.send("Hello, welcome to the articles api!");
});

// this middleware uses the express router to handle all requests to the articles section of the api
// the router is required into the scope and added to the middleware as the callback for that route, and all the endpoints in that particular router will handle any further url segments such as id etc
const articles = require("./routes/articles.js");
const users = require("./routes/users.js");
app.use("/articles", articles);
app.use("/users", users);

// ERRORS ----------------------------------------------------------------
// any request or response errors will be handled and displayed here

// if a request comes through and doesn't match any endpoints, it will continue to be passed down until it gets here. This middleware matches everything and returns 404 endpoint not found
app.use((req, res, next) => {
  const error = new Error("Endpoint Not Found");
  error.status = 404;
  next(error);
});

// development error handler
// will print stacktrace if not in prod
// this middleware has 4 parameters, which tells express that it is an error handler, and it will be executed if any errors are caught. The first paramter will therefore be any error objects passed through the endpoints and middlewares
app.use((err, req, res, next) => {
  // the the app is not set to production mode via this flag variable, print a stacktrace in the console
  if (!isProduction) {
    console.log(err.stack);
  }

  // set status to server error
  res.status(err.status || 500);

  // send the error to the client
  res.json(err);
});
