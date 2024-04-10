const courseService = require("../services/course-service");

class CourseController{ 
    
    async getCourse(req,res){
       try{
        const {courseId} = req.query;
        if(!courseId){
            return res.status(400).json({message : "missing query params"})
        }
        const course = await courseService.getSingleCourse(courseId)
         if(!course){
            return res.status(404).json({message : "Course cannot be fetched"})
         }   
         return res.status(200).json({course});
    }
       catch(error){
        console.log(error);
          return res.status(500).json({message : "Internal server error"})
       }
    }
    async getCourses(req, res){
        try{
            let filter = {course_publishedStatus : true}
            // let options = {course_userRegistered:0, course_reports:0, user_feedback:0, course_publishedStatus:0, course_creatorId : 0}
           const courses = await courseService.getManyCourses(filter, {});
           if(!courses){
            return res.status(404).json({message : "Not able to find the course"})
           }
           return res.status(200).json(courses)
        }
        catch(error){
            console.log(error);
            return res.status(500).json({message : "Internal server error"})
        }
    }
    async getChapter(req, res){
        try{
            const {chapterId} = req.query;
            if(!chapterId){
               return res.status(400).json({message : "Missing query params"})
            }
            let filter = {_id : chapterId};
            let options = {user_feedback : 0, chapter_reports : 0};
            const chapter =  await courseService.getSingleChapter(filter, options)
            if(!chapter){
                return res.status(400).json({message : "can't fetch the chapter"})
            }
            return res.status(200).json(chapter);
        }
        catch(error){
           console.log(error);
           return res.status(500).json({message : "Internal server error"})
        }
    }
}

module.exports = new CourseController();