const serverless = require("serverless-http");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/user-route")
const courseRoute = require("./routes/course-route") 
const quiz_score_route = require("./routes/quiz-score-route")
app.use(cors());
app.use(express.json({limit : "10mb"}));
dotenv.config()
app.use("/user", userRoute)
app.use("/", courseRoute) 
app.use("/user",quiz_score_route);

module.exports.handler = serverless(app);
