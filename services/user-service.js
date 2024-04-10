const User = require("../models/user");
const { Chapter, Course } = require("../models/course");
const dbConnect = require("../dbConnection/db");

let Collection = {
 course: Course,
 chapter: Chapter,
};

class UserService {
  async register(userId, courseId, mappedCourseId) {
     try {
       dbConnect();
       const [findCourse, findUser] = await Promise.all([
         Course.findOne({ _id: courseId, mapped_with: mappedCourseId }),
         User.findOne({ userId: userId }),
       ]);
 
       if (!findUser) {
         throw new Error("User not found with ID: " + userId);
       } else if (!findCourse) {
         throw new Error("Course not found with ID: " + courseId + " and mapped course ID: " + mappedCourseId);
       }
 
       findUser.courses_register = findUser.courses_register || [];
       findCourse.course_userRegistered = findCourse.course_userRegistered || [];
       findUser.user_progress = findUser.user_progress || [];
       findCourse.course_userRegistered.addToSet(userId);
       findUser.courses_register.addToSet(courseId);
 
       // Check if there are any existing objects in user_progress
       const existingProgress = findUser.user_progress.length > 0;
 
       // If there are existing objects, check the conditions
       if (existingProgress) {
         const lastProgress = findUser.user_progress[findUser.user_progress.length - 1];
         if (!lastProgress.isCourseLocked && lastProgress.isCourseCompleted && lastProgress.totalCourseScore >= 75) {
           // All conditions are met, proceed to create a new object in user_progress
           const chapterProgress = findCourse.course_chapters.map((chapter, idx) => {
             if (idx === 0) {
               return {
                 chapterId: chapter,
                 totalChapterScore: 0,
                 ischaptercompleted: true,
                 quizzesCompleted: []
               };
             } else {
               return {
                 chapterId: chapter,
                 totalChapterScore: 0,
                 ischaptercompleted: false,
                 quizzesCompleted: []
               };
             }
           });
 
           findUser.user_progress.push({
             courseId: courseId,
             totalCourseScore: 0,
             chapters: chapterProgress,
             isCourseCompleted: false,
             isCourseLocked: false
           });
         } else {
           // Conditions are not met, skip creating a new object
           console.log("Conditions not met, skipping creation of new object in user_progress.");
           return false; // Return false or handle accordingly
         }
       } else {
         // No existing objects, proceed to create a new object in user_progress
         const chapterProgress = findCourse.course_chapters.map((chapter, idx) => {
           if (idx === 0) {
             return {
               chapterId: chapter,
               totalChapterScore: 0,
               ischaptercompleted: true,
               quizzesCompleted: []
             };
           } else {
             return {
               chapterId: chapter,
               totalChapterScore: 0,
               ischaptercompleted: false,
               quizzesCompleted: []
             };
           }
         });
 
         findUser.user_progress.push({
           courseId: courseId,
           totalCourseScore: 0,
           chapters: chapterProgress,
           isCourseCompleted: false,
           isCourseLocked: false
         });
       }
 
       await Promise.all([findUser.save(), findCourse.save()]);
       return true;
     } catch (error) {
       console.log("error in registering for the course");
       throw new Error(error);
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
