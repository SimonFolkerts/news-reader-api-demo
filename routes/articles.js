// load the router module into a variable
const router = require("express").Router();

// load the article model, this will allow us to talk to the database and work with the articles collection
const Article = require("../models/Article");

// this is a middleware that activates on any request coming in with an id parameter. If an id parameter is present in the request this middleware uses the article model to ask the database to attempt to retreive the matching article, and then it attaches it to the request before sending it along to the endpoints. This way when the request arrives at the end point the article is already retrieved and available, and the code for retreival doesn't have to be repeated for eah endpoint
router.param("id", (req, res, next, id) => {
  // prepare to find a matching article
  Article.findById(id)
    // execute the find, and upon receiving a response, execute a callback function that is automatically passes the return value from the databse
    .then((article) => {
      if (!article) {
        // if no article is present in the response send a 404 response to the client
        res.status(404).send("Article not found");
      } else {
        // otherwise if an article is returned, attach it to the request as a property and then pass the request along
        req.article = article;
        return next();
      }
    })
    // if an error occurs when attempting to query the database, pass it to the next method so that our error handler endpoint can deal with it
    .catch(next);
});

// a get request for finding all articles
router.get("/", (req, res, next) => {
  // prepare to use the article model to aks the database to find all articles (no filter passed in the option object)
  Article.find({}) // <- nothing in the object that is passed as an argument, so it just finds everything
    // specify which fields we want using the select method (can also use a minus sign to exclude things)
    .select("title description")
    // sort by createdAt field in descending order
    .sort({ createdAt: "desc" })
    // now that the query is prepared, execute it and once a response from the database is received, execute a callback that is passed the response automatically
    .then((results) => {
      // send the response from the database down to the client
      return res.send(results);
    })
    // when the query is executed, if the database returns an error catch it here and pass it to the next method so that the eror handling endpoint can process it
    .catch(next);
});

// a post request endpoint for uplaoding articles
router.post("/", (req, res, next) => {
  // incoming data from the client needs to be handled and loaded into the database, mongoose achieves this by loading the raw json data in an instance of the model, called a document. This document is a specific copy of the model that encapsulates the data that was delivered from the client
  // instantiate the model into a new document that contains the data in the request body. Mongoose will mapp the json data to this document object, which will allow it to be saved to the database
  const article = new Article(req.body);
  // now that the article exists as a document object, it can be instructed to save itself into the database
  article
    .save()
    // execute the save and once the response comes back from the database, execute a callback that is passed the result as an argument
    .then((result) => {
      // send the database response back to the client
      return res.status(201).send(result);
    })
    // if there is an error upon trying to execute the save, handle it here as above
    .catch(next);
});

// get a specific article (this is basically already done by the preloader middleware, so just get the article attached to the request and send it back as a response with no further functionality)
router.get("/:id", (req, res, next) => {
  return res.status(200).send(req.article);
});

// similar to post but updating. A different method is used here, findByIdAndUpdate(). There are different ways to achieve the same or similar results so referring to the documentation is important. find() and then save() could also be used here for example
router.put("/:id", (req, res, next) => {
  Article.findByIdAndUpdate(req.article.id, req.body)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
});

// etc
router.delete("/:id", (req, res, next) => {
  Article.findByIdAndDelete(req.article.id)
    .then((article) => {
      res.status(204).send(article);
    })
    .catch(next);
});

module.exports = router;
