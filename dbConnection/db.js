const mongoose = require("mongoose");

function dbConnect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB ✅"))
    .catch(error => console.error("Error connecting to DB:", error));
}

module.exports = dbConnect;