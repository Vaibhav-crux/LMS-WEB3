const userController = require("../controllers/user-controller");

const routes = require("express").Router();

routes.post("/register",  userController.registerUser);
routes.post("/courseFeedback", userController.giveFeedbackCourse);
routes.post("/chapterFeedback", userController.giveFeedbackChapter);
routes.post("/raiseFlag", userController.raiseFlag);
routes.get("/myCourse", userController.myCourse);  
routes.get('/getStatus', userController.getStatus);
routes.get("/checkStatusofCourse",userController.checkCourseStatus);
routes.get("/myprogress",userController.myProgress);
module.exports  = routes;