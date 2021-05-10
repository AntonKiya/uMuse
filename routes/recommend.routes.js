const {Router} = require('express');
const pool = require('../pool');
const authMiddleware = require('../middleware/auth.middleware');
const {check, validationResult} = require('express-validator');

const router = Router();


// /api/recommend/mentors
router.get('/mentors', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа');
        }

        const userId = req.user.userId;

        const data = await pool.query('SELECT "id_mentor", "interest", "photoMentor", "city", "connectMentor", "ageMentor", "aboutMentor", "experience", "educationMentor", direction FROM mentor, student ,city,"interestsMentor", experience, direction,"interestsStudent", "interest" ' +
            'WHERE "interestsStudent"."interestStudent_id" = "interestsMentor"."interestMentor_id" ' +
            'AND "interestsMentor".mentor_id = mentor.id_mentor ' +
            'AND "city".id_city = mentor."cityMentor_id" ' +
            'AND experience."id_experience" = mentor."experienceMentor_id" ' +
            'AND direction.id_direction = mentor."directionMentor_id" ' +
            'AND interest.id_interest = "interestsMentor"."interestMentor_id" ' +
            'AND mentor."cityMentor_id" = student."cityStudent_id" ' +
            'AND "interestsStudent".student_id = $1 ' +
            'AND "student".id_student = $1', [userId]);

        const mentors = [];

        for (item of data.rows) {

            const mentor = item;

            const {id_mentor, interest, photoMentor, city, connectMentor, ageMentor, aboutMentor, experience, educationMentor, direction} = mentor;

            const result = await mentors.find( elem => elem.id_mentor === mentor.id_mentor );

            if (result) {

               result.interests.push(mentor.interest);
            }
            else {


                mentors.push({id_mentor, interest, photoMentor, city, connectMentor, ageMentor, aboutMentor, experience, educationMentor, direction, interests: [mentor.interest]});
            }
        }

        res.json(mentors);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения рекомендуемых наставников ' + e.message});
    }
});


// /api/recommend/oneMentor
router.get('/oneMentor/:idMentor', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;

        const idMentor = req.params.idMentor;

        const data = await pool.query('SELECT id_mentor, sex,interest, "nameMentor", "city", "photoMentor","emailMentor", "connectMentor", "ageMentor", "aboutMentor", "experience", "educationMentor", direction FROM mentor, city, sex,"interestsMentor", experience, direction, "interest" ' +
            'WHERE "interestsMentor".mentor_id = mentor.id_mentor ' +
            'AND interest."id_interest" = "interestsMentor"."interestMentor_id" ' +
            'AND "city".id_city = mentor."cityMentor_id" ' +
            'AND "sex".id_sex = mentor."sexMentor_id" ' +
            'AND experience."id_experience" = mentor."experienceMentor_id" ' +
            'AND direction.id_direction = mentor."directionMentor_id" ' +
            'AND "mentor".id_mentor = $1;', [idMentor]);

        let mentor = {};

        for (item of data.rows) {

            const {id_mentor, interest, photoMentor, sex, nameMentor, city, connectMentor, emailMentor, ageMentor, aboutMentor, experience, educationMentor, direction} = item;

            if (mentor.hasOwnProperty('id_mentor')) {

                mentor.interests.push(interest);
            }
            else {

                mentor = {id_mentor,interests: [interest], photoMentor, nameMentor,city, sex,emailMentor,connectMentor,ageMentor,aboutMentor,experience,educationMentor,direction};
            }
        }

        if (mentor.id_mentor) {

            res.json(mentor);
        }
        else {

            throw new Error('No data found');
        }

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения рекомендуемых наставников ' + e.message});
    }
});

module.exports = router;
