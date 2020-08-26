const router = require("express").Router();
const Article = require("../models/Article");

router.param("id", (req, res, next, id) => {
  Article.findById(id)
  .populate("author")
    .then((article) => {
      if (!article) {
        res.status(404).send("Article not found");
      } else {
        req.article = article;
        return next();
      }
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  Article.find({})
    .select("title description")
    .sort({ createdAt: "desc" })
    .then((results) => {
      return res.send(results);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const article = new Article(req.body);
  article
    .save()
    .then((result) => {
      return res.status(201).send(result);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  return res.status(200).send(req.article);
});

router.put("/:id", (req, res, next) => {
  Article.findByIdAndUpdate(req.article.id, req.body)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Article.findByIdAndDelete(req.article.id)
    .then((article) => {
      res.status(204).send(article);
    })
    .catch(next);
});

module.exports = router;
