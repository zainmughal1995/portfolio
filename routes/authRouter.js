const express = require("express");
const {
  get_signup,
  post_signup,
  get_login,
  post_login,
  logout_get,
} = require("../controllers/authControllers");

const authRouter = express.Router();

authRouter.get("/signup", get_signup);
authRouter.post("/signup", post_signup);
authRouter.get("/login", get_login);
authRouter.post("/login", post_login);
authRouter.get("/logout", logout_get);

module.exports = authRouter;
