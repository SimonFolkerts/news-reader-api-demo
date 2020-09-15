const router = require("express").Router();
const User = require("../models/User.js");
const Article = require("../models/Article.js");

// same sort of stuff here as in the articles router, though there is authentication here too which has been commented

// if there is a user id in the request url, the matching user is found here and attached to the request for processing once the request reaches an endpoint
router.param("id", (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        req.user = user;
        return next();
      }
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  User.find({})
    .sort({ createdAt: "desc" })
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  res.status(200).send(req.user);
});

// router.post("/", (req, res, next) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then((result) => {
//       return res.status(201).send(result);
//     })
//     .catch(next);
// });

router.put("/:id", (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  User.findByIdAndDelete(req.user.id).then((result) => {
    res.status(200).send(result);
  });
});

// Users' Articles

// this endpoint finds articles as above, but this time using a filter passed into the method. It retreives only those articles where the value of the author property equals the user id passed in through the request
router.get("/:id/articles", (req, res, next) => {
  // find all articles with an author value that matches the id of the user that was attached via the preloader
  Article.find({ author: req.user.id })
    .sort({ createdAt: "desc" })
    .then((articles) => {
      return res.status(200).send(articles);
    })
    .catch(next);
});

// this endpoint saves an article to the database, but also attaches the id of the user that the prelaoder attached to the request, and also updates the users article array with the id of the new article
router.post("/:id/articles", (req, res, next) => {
  // to save the data in the body a new document is instantiated from the article model to encapsulate the req data
  const article = new Article(req.body);
  // the articles' author property is updated with the id of the user that was preloaded ( this is the user who is uplaoding the article and sent their id in the url of the request )
  article.author = req.user.id;
  // save the article document to the database
  article
    .save()
    // execute the save and once the response from the database confirms uplaod, update the users array of owned articles
    .then((article) => {
      // if the user has no article array, add one
      if (!req.user.articles) {
        req.user.articles = [];
      }
      // push the article document that was created into the attached users' article array ( due to the schema specifying an objectId mongoose will just fish out the id from the document and save that in the array)
      req.user.articles.push(article);
      // once the user document has been updated, instruct it to save to the database
      req.user
        .save()
        .then((user) => {
          res.status(201).send({ article: article, user: user });
        })
        // if saving the user causes an error on the database, it is caught here
        .catch(next);
    })
    //if saving the article to the database causes an error, it is caught here
    .catch(next);
});

// Auth

// endpoint for logging in
router.post("/login", (req, res, next) => {
  // if there is no email in the body, send an error back to the client
  if (!req.body.email) {
    return res.status(422).send("Email can't be blank");
  }

  // find a matching user based on the email address
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (!user) {
        // if there is no matching user in the response, send an error tot the client
        return res.status(422).send("User not found");
      }
      // otherwise, if there is a match, send that user back. This serves as confirmation that the user is authorised (this is extremely basic and insecure and should never be used in production, it is purely to intriduce the concept of state managament)
      return res.send(user);
    })
    .catch(next);
});

router.post("/register", function (req, res, next) {
  //server-side validation
  if (!req.body.firstname) {
    return res.status(422).send("First name can't be blank");
  }
  if (!req.body.lastname) {
    return res.status(422).send("Last name can't be blank");
  }
  if (!req.body.username) {
    return res.status(422).send("Username can't be blank");
  }
  if (!req.body.email) {
    return res.status(422).send("Email can't be blank");
  }

  // find a mathcing user based on email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // if a user is found that means the email is already taken
        return res.status(422).send("User already exists");
      }
      // otherwise if there is no user, uplaod a new user by instantianting the user model to encapsulate the user data in the req
      const newUser = new User(req.body);
      newUser
        .save()
        // execute the save
        .then((result) => {
          return res.send(result);
        })
        // if there was an error trying to save the user handle it here
        .catch(next);
    })
    // if there was an error trying to find the user handle it here
    .catch(next);
});

module.exports = router;
