// Import the mongoose module
const mongoose = require("mongoose");
// Import the Quiz and Test models from the test module
const {Quiz, Test} = require("./test");

// Define the Chapter schema
const ChapterSchema = new mongoose.Schema({
    // Unique identifier for the chapter
    chapterId: { type: String },
    // Array of course IDs that this chapter is part of
    courseId: [{ type: String, required : true}],
    // Name of the chapter
    chapter_name: String,
    // Course mapped with
    mapped_with: String,
    // Description of the chapter
    chapter_description: String,
    // Array of video URLs for the chapter
    chapter_videos: [String],
    // Array of image URLs for the chapter
    chapter_images: [String],
    // Feedback from users on the chapter
    user_feedBack: [{
        userId: { type: String, required : true},
        message: { type: String, required: true }
    }],
    // Array of quiz IDs associated with the chapter
    chapter_quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz" // Reference to the Quiz model
    }],
    // Array of user IDs who have reported issues with the chapter
    chapter_reports : [
        {userId : {type : String, required : true}}
     ]
});

// Define the Course schema
const CourseSchema = new mongoose.Schema({
    // Unique identifier for the course
    courseId: { type: String},
    // Name of the course
    course_name: { type: String, required: true },
    // Short heading for the course
    course_ShortHeading: String,
    // Description of the course
    course_description: String,
    // URL of the course banner image
    course_BannerImage: String,
    // URL of the course banner video
    course_Bannervideo: String,
    // Date the course was created
    course_createdDate : {type : Date, default : Date.now},
    // ID of the user who created the course
    course_creatorId: {
        type: String,
    },
    // Name of the user who created the course
    course_creatorName : {type : String, require : true},
    // Whether the course is published
    course_publishedStatus: { type: Boolean, default: false },
    // Whether the course is free or paid
    course_freeTier: { type: String, default: "free", enum: ["free", "paid"] },
    // Array of chapter IDs that are part of the course
    course_chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter", // Reference to the Chapter model
        required: true
    }], 
    // Array of test IDs that are part of the course
    course_test: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test" // Reference to the Test model
    }],
    // Array of user IDs who have registered for the course
    course_userRegistered: [{
        type: String,
    }],
    // Category of the course
    course_category : {type:String},
    // Tags associated with the course
    course_tags : [String],
    // Feedback from users on the course
    user_feedBack: [{
        userId: { type: String, required : true},
        message: { type: String, required: true }
    }],
    // Badge provided upon course completion
    course_badgeProvide: String,
    // Ratings from users
    course_rating :[ 
        {
      user : {type : String},
      rating : {type : Number}
    }
],
    // Array of user IDs who have reported issues with the course
    course_reports : [
        {userId : String}
    ]
}, 
{timestamps : true} // Automatically add createdAt and updatedAt fields
);

// Create the Course model from the CourseSchema
const Course = mongoose.model("Course", CourseSchema);
// Create the Chapter model from the ChapterSchema
const Chapter = mongoose.model("Chapter", ChapterSchema);

// Export the Course and Chapter models
module.exports = { Course, Chapter };
