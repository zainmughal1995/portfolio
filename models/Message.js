const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  head: {
    type: String,
    required: [true, "Please enter your name"],
  },
  body: {
    type: String,
    required: [true, "You cannot send an empty message"],
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
