const User = require("../models/user");
const { Chapter, Course } = require("../models/course");
const dbConnect = require("../dbConnection/db");

let Collection = {
  course: Course,
  chapter: Chapter,
};

class UserService {
  async register(userId, courseId) {
    try {
       dbConnect();
       const [findCourse, findUser] = await Promise.all([
         Course.findOne({ _id: courseId }),
         User.findOne({ userId: userId }),
       ]);
   
       if (!findUser || !findCourse) {
         throw new Error("user or course not found");
       }
       findUser.courses_register = findUser.courses_register || [];
       findCourse.course_userRegistered = findCourse.course_userRegistered || [];
       findUser.user_progress = findUser.user_progress || [];
       findCourse.course_userRegistered.addToSet(userId);
   
       const findchapterIds = findCourse.course_chapters;
       console.log("findCourse", findCourse);
       console.log("findchapterIds:", findchapterIds);
       const chapterProgress = findchapterIds.map((chapter, idx) => {
         if (idx == 0) {
           return {
             chapterId: chapter,
             totalChapterScore: 0,
             ischaptercompleted: true,
             quizzesCompleted: []
           }
         } else {
           return {
             chapterId: chapter,
             totalChapterScore: 0,
             ischaptercompleted: false,
             quizzesCompleted: []
           }
         }
       });
   
       console.log("chapterProgress:", chapterProgress);
   
       // Check if user_progress is empty or if there's a course with isCourseCompleted true and totalCourseScore >= 75
       const canCreateNewCourse = findUser.user_progress.length === 0 || findUser.user_progress.some(progress => progress.isCourseCompleted && progress.totalCourseScore >= 75);
   
       if (canCreateNewCourse) {
         // Calculate the total score for all chapters
         const totalChapterScore = chapterProgress.reduce((total, chapter) => total + chapter.totalChapterScore, 0);
         // Determine if the course is completed based on the total score
         const isCourseCompleted = totalChapterScore >= 75 ? true : false;
         // Check if user_progress is empty and set isCourseLocked accordingly
         const isCourseLocked = findUser.user_progress.length === 0 ? false : true;
         // Only add the course ID to courses_register if isCourseLocked is false
         if (!isCourseLocked) {
           findUser.courses_register.addToSet(courseId);
         }
         findUser.user_progress.push({
           courseId: courseId,
           totalCourseScore: totalChapterScore, // Use the total score calculated above
           chapters: chapterProgress,
           isCourseCompleted: isCourseCompleted, // Set based on the total score
           isCourseLocked: isCourseLocked // Set based on the condition
         });
       } else {
         throw new Error("Cannot create a new course. A course with isCourseCompleted true and totalCourseScore >= 75 already exists.");
       }
   
       await Promise.all([findUser.save(), findCourse.save()]);
       return true;
    } catch (error) {
       console.log("error in registering for the course");
       // Format the error message as a JSON response
       throw { message: "Please firstly complete previous course" };
    }
   }
   
   
   
  async getCourse(userId) {
    try {
      dbConnect();
      const course = await User.find(
        { userId: userId },
        { courses_register: 1, userId: 1 }
      ).populate("courses_register");
      return course;
    } catch (error) {
      console.log("error in getting the course");
      throw new Error(error);
    }
  }

  async checkCourseStatus(userId, courseId) {
    try {
      dbConnect();
      const user = await User.findOne({ userId: userId });
      if (!user) {
        throw new Error("User not found");
      }
      const course = user.courses_register.find(
        (course) => String(course) === String(courseId)
      );
      if (!course) {
        throw new Error("Course not found");
      }
      return course;
    } catch (error) {
      console.log("Error in getting the course:", error);
      throw error; // Re-throw the error to be caught in the controller
    }
  }

  async feedback(id, data, collection) {
    try {
      dbConnect();
      const updatedDocument = await Collection[collection].findOneAndUpdate(
        { _id: id },
        { $push: { user_feedBack: data } },
        { upsert: true, new: true }
      );
      return updatedDocument;
    } catch (error) {
      console.log("error in feedback");
      throw new Error(error);
    }
  }

  async raiseFlag(chapterId, data) {
    try {
      dbConnect();
      const raise = await Chapter.updateOne(
        { _id: chapterId },
        { $push: { chapter_reports: data } },
        { upsert: true, new: true }
      );
      return raise;
    } catch (error) {
      console.log("error in raising flag");
      throw new Error(error);
    }
  }

  async getUserProgress(userId) {
    try {
      dbConnect();
      const user = await User.findOne({ userId: userId }).select(
        "user_progress"
      );
      return user ? user.user_progress : null;
    } catch (error) {
      console.log("error in getting user progress");
      throw new Error(error);
    }
  }
  async getStatus(userId, courseId) {
    try {
      dbConnect();
      const getCourse = await Course.findById(courseId);
      let status;
      if (getCourse) {
        status = getCourse.course_userRegistered.some(
          (item) => item === userId
        );
      }

      return status;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new UserService();
