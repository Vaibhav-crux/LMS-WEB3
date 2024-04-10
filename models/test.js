/* The code is defining Mongoose schemas and models for a test and quiz system. */
const mongoose = require("mongoose");


const MCQSchema = new mongoose.Schema({
    quizStatement: { type: String, required: true },
    Numberofoptions: { type: Number, required: true },
    quizOptions: { type: [String], required: true },
    correctOptionIndex: { type: Number, required: true }
});

const MatchingSchema = new mongoose.Schema({
    quizStatement: { type: String, required: true },
    NumberofColumns: { type: Number, required: true },
    quizLeftColumn: { type: [String], required: true },
    quizRightColumn: { type: [String], required: true },
    correctOption: { type: Map, of: String, required: true }
});

const SubjectiveSchema = new mongoose.Schema({
    quizStatement: { type: String, required: true },
    ExpectedAnswer: { type: String, required: true },
    Limit: { type: Number, default: 500 }
});

const quizSchema = new mongoose.Schema({
    quizId: { type: String },
    quizType: { type: String, enum: ["multiple_choice", "matching", "subjective"], required: true },
    publishedStatus: { type: Boolean, default: true},
    quiz: {},
    quizLevel: { type: String, enum: ["easy", "medium", "hard"], required: true },
    quizTags: { type: [String] },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    feedback: [
        {
            userId: { type: String },
            message: { type: String }
        }
    ],
    timeDuration: { type: Number, default: 300 },
    creatorId: { type: String, required: true }
});

quizSchema.methods.setDynamicSchema = function () {
    switch (this.quizType) {
        case "multiple_choice":
            this.quiz = MCQSchema;
            break;
        case "matching":
            this.quiz = MatchingSchema;
            break;
        case "subjective":
            this.quiz = SubjectiveSchema;
            break;
        default:
            throw new Error("Invalid quiz type specified");
    }
};


const testSchema = new mongoose.Schema({
    testId: { type: String },
    testName: { type: String, required: true },
    quizs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    }],
    numberofQuiz: Number,
    timeDuration: Number,
    feedback: [
        {
            userId: { type: String },
            message: { type: String }
        }
    ],
    publishedStatus: { type: Boolean, default: true },
    creatorId: { type: String, required: true }
});

const Test = mongoose.model("Test", testSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = { Test, Quiz };
