const router = require("express").Router();
const User = require("../models/User.js");
const Article = require("../models/Article.js");

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

router.get("/:id/articles", (req, res, next) => {
  Article.find({ author: req.user.id })
    .sort({ createdAt: "desc" })
    .then((articles) => {
      return res.status(200).send(articles);
    })
    .catch(next);
});

router.post("/:id/articles", (req, res, next) => {
  const article = new Article(req.body);
  article.author = req.user.id;
  article
    .save()
    .then((article) => {
      if (!req.user.articles) {
        req.user.articles = [];
      }
      req.user.articles.push(article);
      req.user
        .save()
        .then((user) => {
          res.status(201).send({ article: article, user: user });
        })
        .catch(next);
    })
    .catch(next);
});

// Auth

router.post("/login", (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).send("Email can't be blank");
  }

  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (!user) {
        return res.status(422).send("User not found");
      }
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

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(422).send("User already exists");
      }
      const newUser = new User(req.body);
      newUser
        .save()
        .then((result) => {
          return res.send(result);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
