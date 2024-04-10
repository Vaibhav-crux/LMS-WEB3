// Import the database connection module
const dbConnect = require("../dbConnection/db");
// Import the Course and Chapter models from the models directory
const {Course, Chapter} = require("../models/course");

// Define the CourseService class
class CourseService{
 // Method to fetch a single course by its ID
 async getSingleCourse(courseId){
    // Connect to the database
    dbConnect();
    try{
      // Find a course by its ID and populate its chapters
      const fetchCourse = await Course.findById(courseId).populate("course_chapters");
      // Return the fetched course
      return fetchCourse;
    }
    catch(error){
      // If an error occurs, throw it
      throw new Error(error);
    }
 }

 // Method to fetch multiple courses based on a filter and options
 async getManyCourses(filter, options){
    try{
      // Connect to the database
      dbConnect();
      // Find courses based on the provided filter, populate their chapters, and execute the query
      const courses = await Course.find(filter).populate("course_chapters").exec();
      // Return the fetched courses
      return courses;
    }
    catch(error){
      // If an error occurs, throw it
      throw new Error(error);
    }
 }

 // Method to fetch a single chapter based on a filter and options
 async getSingleChapter(filter, options){
    try{
      // Connect to the database
      dbConnect();
      // Find a chapter based on the provided filter, populate its quiz with all fields except the correctOptionIndex, and execute the query
      const chapter = await Chapter.find(filter, options).populate({ path: "chapter_quiz", select : "-quiz.correctOptionIndex"}).exec();
      // Return the fetched chapter
      return chapter;
    }
    catch(error){
      // If an error occurs, throw it
      throw new Error(error);
    }
 }
}

// Export an instance of the CourseService class
module.exports = new CourseService();
