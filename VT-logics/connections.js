const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  course_id: String,
  mapped_course_id: String,
});

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;
