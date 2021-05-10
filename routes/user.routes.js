const {Router} = require('express');
const {check, validationResult} = require('express-validator')
const pool = require('../pool');
const authMiddleware = require('../middleware/auth.middleware')

const router = Router();


//  /api/user/profileStudent
router.get('/profileStudent',
    authMiddleware,
    async (req, res) => {
        try{

            if (req.user.role !== 'student') {
                return res.status(403).json('У вас нет прав доступа')
            }

            const userId = req.user.userId;

            const user = await pool.query('SELECT "id_student", "emailStudent", "connectStudent","nameStudent", "ageStudent", "aboutStudent", "city", "photoStudent" ' +
                'FROM "student", "city" ' +
                'WHERE "id_student" = $1' +
                'AND city."id_city" = student."cityStudent_id" ', [userId]);

            if (!user.rows[0]) {

                res.status(404).json({message: 'No data found'});
            }

            const interests = await pool.query('SELECT "interest" from "interestsStudent", "interest" WHERE "interestsStudent"."student_id" = $1 AND "interest"."id_interest" = "interestsStudent"."interestStudent_id";', [userId]);

            user.rows[0].interests = interests.rows;

            res.json(user.rows[0]);

        }catch (e){
            res.status(500).json({message: 'Что-то пошло не так в блоке профиля студента ' + e.message});
        }
    });



//  /api/user/profileMentor
router.get('/profileMentor',
    authMiddleware,
    async (req, res) => {
        try{

            if (req.user.role !== 'mentor') {
                return res.status(403).json('У вас нет прав доступа')
            }

            const userId = req.user.userId;

            const user = await pool.query('SELECT "id_mentor", "emailMentor", "connectMentor", "nameMentor" ,"ageMentor","educationMentor" ,"direction", "experience", "city", "sex", "photoMentor","aboutMentor" ' +
                'FROM mentor, direction, experience, city, sex ' +
                'WHERE mentor.id_mentor = $1' +
                'AND city."id_city" = mentor."cityMentor_id" ' +
                'AND direction."id_direction" = mentor."directionMentor_id" ' +
                'AND experience."id_experience" = mentor."experienceMentor_id" ' +
                'AND sex."id_sex" = mentor."sexMentor_id";', [userId]);

            if (!user.rows[0]) {

                res.status(404).json({message: 'No data found'});
            }

            const interests = await pool.query('SELECT "interest" from "interestsMentor", "interest" WHERE "interestsMentor"."mentor_id" = $1 AND "interest"."id_interest" = "interestsMentor"."interestMentor_id";', [userId]);

            user.rows[0].interests = interests.rows;

            res.json({user: user.rows[0]});

        }catch (e){
            res.status(500).json({message: `Что-то пошло не так в блоке профиля ментора ${e}`});
        }
    });



//  /api/user/getPhoto
router.get('/getPhoto/:photo', (req, res) => {
    try {

        const photo = req.params.photo;

        res.sendFile(`/Users/macbookpro/programming/Web/uMuse/uploads/${photo}`);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения фото ' + e.message});
    }
});


module.exports = router;
