const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an Email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "You cannot leave password empty"],
    minlength: [6, "Password shall not be less than 7 characters"],
  },
});

UserSchema.pre("save", async function (next) {
  // Generate a salt
  const salt = await bcrypt.genSalt();
  // Hash the password with the salt
  const hash = await bcrypt.hash(this.password, salt);
  // Replace the plain password with the hashed password
  this.password = hash;
  // Proceed to save the user
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
