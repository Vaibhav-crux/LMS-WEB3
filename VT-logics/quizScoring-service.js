const dbConnect = require("../dbConnection/db");
const { Course, Chapter } = require("../models/course");
const { Quiz } = require("../models/test");
const User = require("../models/user");

class QuizService {
  async createScoreofQuiz(courseId, chapterId, quizId, chosenOption, userId) {
    try {
      dbConnect();
      // Find the user
      const user = await User.findOne({ userId: userId });
      if (!user) {
        throw new Error("User not found");
      }
      const course = await Course.findById(courseId); 
      const chapter = await Chapter.findById(chapterId);
      const quiz = await Quiz.findById(quizId);
      // console.log(quiz);
      if (!course || !chapter || !quiz) {
        throw new Error("Course, Chapter, or Quiz not found");
      }

      const courseProgress = user.user_progress.findIndex(
        (progress) => progress.courseId.toString() === courseId.toString()
      );

      if (courseProgress === -1) {
        throw new Error("Course not found in progress");
      }

      let chapterProgressIndex = user.user_progress[
        courseProgress
      ].chapters.findIndex(
        (chapterProgress) =>
          chapterProgress.chapterId.toString() === chapterId.toString()
      );   

      const totalchapter = user.user_progress[courseProgress].chapters.length; 
      console.log(totalchapter)

      const nextchapterProgressIndex = chapterProgressIndex+1 === totalchapter?chapterProgressIndex:chapterProgressIndex+1;
      const checkchapterRegister = user.user_progress[courseProgress].chapters
        .length
        ? false
        : true;

      if (chapterProgressIndex === -1) {
        // If chapter progress does not exist, create a new one
        let chapterProgress = {
          chapterId: chapterId,
          quizzesCompleted: [],
          totalChapterScore: 0,
          ischaptercompleted: checkchapterRegister,
        };
        user.user_progress[courseProgress].chapters.push(chapterProgress);
        // user.user_progress.push({
        //   courseId,
        //   totalCourseScore: 0,
        //   chapters: [chapterProgress],
        // });
        chapterProgressIndex = 0;
      }
      // console.log("1");

      const quizProgressIndex = user.user_progress[courseProgress].chapters[
        chapterProgressIndex
      ].quizzesCompleted.findIndex(
        (quizProgress) => quizProgress.quizId.toString() === quizId.toString()
      );

      // console.log("2");

      const score = calculateQuizScore(quiz, chosenOption);
      let update = false;
      if (quizProgressIndex === -1) {
        update = true;
        user.user_progress[courseProgress].chapters[
          chapterProgressIndex
        ].quizzesCompleted.push({
          quizId: quizId,
          score: score,
        });
        console.log("Quiz score saved successfully");
        const quizCompleted =
          user.user_progress[courseProgress].chapters[chapterProgressIndex]
            .quizzesCompleted.length == chapter.chapter_quiz.length
            ? true
            : false;
        user.user_progress[courseProgress].chapters[
          chapterProgressIndex
        ].totalChapterScore += score;
        user.user_progress[courseProgress].totalCourseScore += score;
        user.user_progress[courseProgress].chapters[
          nextchapterProgressIndex
        ].ischaptercompleted = quizCompleted;
        
        const coursecomplete =
        user.user_progress[courseProgress].chapters.length ==
        course.course_chapters.length
            ? true
            : false;
        user.user_progress[courseProgress].isCourseCompleted = coursecomplete;

        let totalCourseScore = 0;
        user.user_progress[courseProgress].chapters.forEach(chapter => {
        totalCourseScore += chapter.totalChapterScore;
        });

        const isCourseCompleted = totalCourseScore >= 75 ? true : false;

        user.user_progress[courseProgress].isCourseCompleted = isCourseCompleted;
      } 
      
      else if (quizProgressIndex !== -1) {  
        console.log(chapterProgressIndex,nextchapterProgressIndex); 
        update = true;
        // console.log("Already update") 
        const quizIndex = user.user_progress[courseProgress].chapters[chapterProgressIndex].quizzesCompleted.findIndex(
          (quiz) => quiz.quizId.toString() === quizId
        );
        const alreadyscore = user.user_progress[courseProgress].chapters[chapterProgressIndex].quizzesCompleted[quizIndex].score
        user.user_progress[courseProgress].chapters[
          chapterProgressIndex
        ].totalChapterScore -= alreadyscore;  
        let totalchapterscore = user.user_progress[courseProgress].chapters[chapterProgressIndex].totalChapterScore
        totalchapterscore+=score  
        user.user_progress[courseProgress].chapters[chapterProgressIndex].quizzesCompleted[quizIndex].score = score
        // console.log(score);
        user.user_progress[courseProgress].chapters[
          chapterProgressIndex 
        ].totalChapterScore = totalchapterscore;
        const quizCompleted =
          user.user_progress[courseProgress].chapters[chapterProgressIndex]
            .quizzesCompleted.length == chapter.chapter_quiz.length
            ? true
            : false; 
        // console.log(user.user_progress);
        user.user_progress[courseProgress].chapters[
          nextchapterProgressIndex
        ].ischaptercompleted = quizCompleted;
        const coursecomplete =
          user.user_progress[courseProgress].chapters.length ==
          course.course_chapters.length
            ? true
            : false;
        user.user_progress[courseProgress].isCourseCompleted = coursecomplete;
      }

      // console.log("3");
      if (update) {
        await user.save();
        return {
          Score: score,
          correct_option: quiz.quiz.correctOptionIndex,
          message: "Quiz score saved successfully",
        };
      } else {
        console.log("Quiz Score Updated");
        return { 
          Score:score,
          correct_option: quiz.quiz.correctOptionIndex,
          message: "Quiz Score Updated",
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

function calculateQuizScore(quiz, chosenOption) {
  return quiz.quiz.correctOptionIndex == chosenOption ? 10 : 0;
}

module.exports = new QuizService();
