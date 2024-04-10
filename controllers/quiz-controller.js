const QuizService = require("../services/quizScoring-service");

class QuizController {
  async QuizScore(req, res) {
    try {
      const { courseId, chapterId, quizId, chosenOption, userId } = req.body;
      if (!userId || !courseId || !chapterId || !quizId || !chosenOption) {
        return res
          .status(400)
          .json({
            message:
              "One of value is Missing in body courseId, chapterId, quizId, chosenOption, userId",
          });
      }
      const quizScore = await QuizService.createScoreofQuiz(
        courseId,
        chapterId,
        quizId,
        chosenOption,
        userId
      );
      return res.status(200).json(quizScore);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new QuizController();
