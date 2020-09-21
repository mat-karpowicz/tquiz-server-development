const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/categories", async (req, res) => {
  const categories = await fetch("https://opentdb.com/api_category.php")
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      return { error: true, message: "Error during categories fetch" };
    });

  res.send(categories);
});

router.post("/questions", async (req, res) => {
  const questions = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${req.body.id}&type=${req.body.type}&encode=base64`
  )
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      if (response.response_code > 0) {
        return { error: true, message: "No that many questions in category" };
      }
      return response;
    })
    .catch((error) => {
      return { error: true, message: "Error during questions fetch" };
    });

  res.send(questions);
});

module.exports = router;
