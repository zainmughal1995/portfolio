const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "User not found") {
    errors.email = "User not found";
  }

  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password";
  }

  if (err.code === 11000) {
    errors.email = "This Email is in use already";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.get_signup = (req, res) => {
  res.render("signup");
};

module.exports.post_signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, "your_secret_key_here", {
      expiresIn: 30000000,
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour
    res.json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
};

module.exports.get_login = (req, res) => {
  res.render("login");
};

module.exports.post_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, "your_secret_key_here", {
      expiresIn: 300000,
    });

    // Set JWT in cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour

    res.json({ user: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
