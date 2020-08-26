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

router.post("/", (req, res, next) => {
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      return res.status(201).send(result);
    })
    .catch(next);
});

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
      return res.status(200).send(articles)
    }).catch(next);
});

router.post("/:id/articles", (req, res, next) => {
  const article = new Article(req.body);
  article.author = req.user.id;
  article.save().then((article) => {
    if(!req.user.articles) {
      req.user.articles = [];
    }
    req.user.articles.push(article)
    res.status(201).send(article);
  }).catch(next);
})

module.exports = router;
