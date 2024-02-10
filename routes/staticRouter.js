const express = require("express");

const staticRouter = express.Router();

staticRouter.get("/", (req, res) => {
  res.render("home");
});

module.exports = staticRouter;
