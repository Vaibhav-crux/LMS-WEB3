// Import the mongoose module
const mongoose = require("mongoose");

// Define the quizResult schema, which represents the result of a quiz taken by a user
const quizResultSchema = mongoose.Schema({
 // Reference to the Quiz model
 quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
 // Score obtained in the quiz
 score: Number,
});

// Define the chapterProgress schema, which represents the progress of a user on a chapter
const chapterProgressSchema = mongoose.Schema({
 // Reference to the Chapter model
 chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
 // Array of quiz results for the chapter
 quizzesCompleted: [quizResultSchema],
 // Total score obtained in the chapter
 totalChapterScore: Number,
 // Whether the chapter is completed
 ischaptercompleted: { type: Boolean, default: false }
});

// Define the progress schema, which represents the overall progress of a user on a course
const progress = mongoose.Schema({
 // Reference to the Course model
 courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
 // Total score obtained in the course
 totalCourseScore: Number,
 // Whether the course is completed
 isCourseCompleted: { type: Boolean, default: false },
 // Whether the course is locked
 isCourseLocked: { type: Boolean, default: true },
 // Mapped Course ID
 mappedCourseId: { type: String, default: "N/A"},
 // Array of chapter progress for the course
 chapters: [chapterProgressSchema]
});

// Define the User schema
const UserSchema = new mongoose.Schema({
 // Unique identifier for the user
 userId: { type: String },
 // Array of course IDs that the user is registered for
 courses_register: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
 // Array of progress objects for the courses the user is enrolled in
 user_progress: [progress],
});

// Create the User model from the UserSchema
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
