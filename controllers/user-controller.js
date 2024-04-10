const userService = require("../services/user-service");

class UserController {
  // Method for registering a user for a course
  async registerUser(req, res) {
    try {
      const { userId, courseId, provider, mappedCourseId } = req.query;
      // Check if required query parameters are missing
      console.log(mappedCourseId)
      if (!userId || !courseId || !provider) {
        return res.status(400).json({ message: "Missing query params" });
      }
      // Concatenate provider and userId to form unique user identifier
      const userid = `${provider}|${userId}`;
      // Call userService to register the user for the course
      const registration = await userService.register(userid, courseId, mappedCourseId);
      // If registration fails, return appropriate response
      if (!registration) {
        return res.status(404).json({ message: "Not able to register" });
      }
      // If registration succeeds, return success message
      return res.status(200).json({ message: "Registered for the course 🙌" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method for providing feedback on a course
  async giveFeedbackCourse(req, res) {
    try {
      const { courseId, userId } = req.query;
      const { message } = req.body;
      // Check if required query parameters and body are missing
      if (!courseId || !userId || !message) {
        return res
          .status(400)
          .json({ message: "Missing query params and body" });
      }
      // Construct feedback data
      let data = {
        userId: userId,
        message: message,
      };
      // Call userService to provide feedback for the course
      const feedback = await userService.feedback(courseId, data, "course");
      // If feedback submission fails, return appropriate response
      if (!feedback) {
        return res.status(400).json({ message: "Feedback not provided" });
      }
      // If feedback submission succeeds, return success message
      return res.status(200).json({ message: "Thanks for giving feedback 👍" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method for providing feedback on a chapter
  async giveFeedbackChapter(req, res) {
    try {
      const { chapterId, userId } = req.query;
      const { message } = req.body;
      // Check if required query parameters and body are missing
      if (!chapterId || !userId || !message) {
        return res
          .status(400)
          .json({ message: "Missing query params and body" });
      }
      // Construct feedback data
      let data = {
        userId: userId,
        message: message,
      };
      // Call userService to provide feedback for the chapter
      const feedback = await userService.feedback(chapterId, data, "chapter");
      // If feedback submission fails, return appropriate response
      if (!feedback) {
        return res.status(400).json({ message: "Feedback not provided" });
      }
      // If feedback submission succeeds, return success message
      return res.status(200).json({ message: "Thanks for giving feedback 👍" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method for raising a flag on a chapter
  async raiseFlag(req, res) {
    try {
      const { chapterId, userId } = req.query;
      // Check if required query parameters are missing
      if (!chapterId || !userId) {
        return res.status(400).json({ message: "Missing query params" });
      }
      // Construct flag data
      let data = {
        userId: userId,
      };
      // Call userService to raise a flag on the chapter
      const flag = await userService.raiseFlag(chapterId, data);
      // If flag raising fails, return appropriate response
      if (!flag) {
        return res.status(400).json({ message: "Error in raising flag" });
      }
      // If flag raising succeeds, return success message
      return res.status(200).json({ message: "Raised flag 🚩" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method for retrieving courses for a user
  async myCourse(req, res) {
    try {
      const { userId } = req.query;
      // Check if required query parameters are missing
      if (!userId) {
        return res.status(400).json({ message: "Missing query params" });
      }
      // Call userService to get courses for the user
      const getCourse = await userService.getCourse(userId);
      // If course retrieval fails, return appropriate response
      if (!getCourse) {
        return res
          .status(404)
          .json({ message: "Issue in finding your course" });
      }
      // If course retrieval succeeds, return courses
      return res.status(200).json(getCourse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method for retrieving status of a user for a specific course
  async getStatus(req, res) {
    const { provider, userId, courseId } = req.query;
    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing query params" });
    }
    // Construct unique user identifier
    const userid = `${provider}|${userId}`;
    try {
      // Call userService to get status
      const getStatus = await userService.getStatus(userid, courseId);
      // Return status
      return res.status(200).json(getStatus);
    } catch (error) {
      console.log(error);
    }
  }

  // Method for checking status of a course for a user
  async checkCourseStatus(req, res) {
    try {
      const { userId, provider, courseId } = req.query;
      // Check if required query parameters are missing
      if (!userId || !provider || !courseId) {
        return res
          .status(400)
          .json({ message: "Missing query params userId, provider, courseId" });
      }
      // Construct unique user identifier
      const userid = `${provider}|${userId}`;
      // Call userService to check course status
      const course = await userService.checkCourseStatus(userid, courseId);
      // If course not found, return appropriate response
      if (!course) {
        return res.status(400).json({ message: "Course not found" });
      }
      // If user already registered for course, return success message
      return res
        .status(200)
        .json({ message: "User already registered for course" });
    } catch (error) {
      console.log("Internal server error:", error);
      return res.status(400).json({ message: "Course not found" });
    }
  }

  // Method for retrieving user's progress
  async myProgress(req, res) {
    try {
      const { userId, provider } = req.query;
      // Check if required query parameters are missing
      if (!userId || !provider) {
        return res
          .status(400)
          .json({ message: "Missing query params userId, provider" });
      }
      // Construct unique user identifier
      const userid = `${provider}|${userId}`;
      // Call userService to get user's progress
      const userProgress = await userService.getUserProgress(userid);
      // If user progress exists, return it
      if (userProgress) {
        return res.status(200).json({ message: userProgress });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
