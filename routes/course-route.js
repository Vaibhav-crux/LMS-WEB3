const courseController = require("../controllers/course-controller");
const routes = require("express").Router();

routes.get("/course", courseController.getCourse);
routes.get("/courses", courseController.getCourses);
routes.get("/chapter",  courseController.getChapter);
module.exports = routes;