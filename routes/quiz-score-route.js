const QuizController = require("../controllers/quiz-controller");
const routes = require("express").Router();

routes.post("/markQuizScore", QuizController.QuizScore);
module.exports = routes;