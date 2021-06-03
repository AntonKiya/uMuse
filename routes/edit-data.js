const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {check, validationResult} = require('express-validator');
const pool = require('../pool');

const router = Router();


//  /api/edit-data/editStudent
router.patch('/editStudent',
    [
        check('name', 'некорректное имя').matches(/^[a-zA-Zа-яА-Я\s]+$/),
        check('age', 'возраст только цифрами').isNumeric().notEmpty(),
    ],
    authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {

            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
            });
        }

        const userId = req.user.userId;

        const {name, age, connect, about, interests} = req.body;

        if (interests.length === 0) {

            return res.status(400).json({message: 'Интересы должны содерать хотя бы один интерес'})
        }

        const update = await pool.query('UPDATE "student" SET "nameStudent" = $1, "ageStudent" = $2, "connectStudent" = $3,"aboutStudent" = $4 WHERE "id_student" = $5;', [name, age, connect, about, userId]);

        await pool.query('DELETE FROM "interestsStudent" WHERE "student_id" = $1', [userId]);

        await interests.forEach((item) => {
            pool.query('insert into "interestsStudent" ("student_id", "interestStudent_id") VALUES ($1, $2) ', [userId, item]);
        });

        if (update.rowCount === 0) {

            throw new Error();
        }

        res.json({message: 'Data updated.', status: 'ok'});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля ученика ' + e.message});
    }
});


//  /api/edit-data/infstudent
router.get('/infstudent', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;

        const data = await pool.query('SELECT "nameStudent", "ageStudent", "connectStudent","aboutStudent", "interestStudent_id" ' +
            'FROM "student", "interestsStudent" ' +
            'WHERE "student".id_student = $1 ' +
            'AND "interestsStudent".student_id = $1; ', [userId]);

        let student = {};

        for (item of data.rows) {

            if (!student.nameStudent) {

                student = {...item, interests: [item.interestStudent_id]}
            }
            else {

                student.interests.push(item.interestStudent_id);
            }

        }

        if (data.rowCount === 0) {

            throw new Error('No data found');
        }

        res.json(student);

    }
    catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке ред информации о ученике ' + e.message});
    }
});


//  /api/edit-data/editMentor
router.patch('/editMentor',
    [
        check('name', 'некорректное имя').matches(/^[a-zA-Zа-яА-Я\s]+$/),
        check('age', 'некорректный возраст').isInt({min: 1}).notEmpty(),
    ],
    authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {

            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
            });
        }

        const userId = req.user.userId;

        const {name, direction, experience, city, sex, age, education, about, interests} = req.body;

        if (interests.length === 0) {

            return res.status(400).json({message: 'Упс...Навыки должны содерать хотя бы один навык'});
        }

        const update = await pool.query('UPDATE "mentor" SET "nameMentor" = $1, "directionMentor_id" = $2, "experienceMentor_id" = $3, "cityMentor_id" = $4, "sexMentor_id" = $5, "ageMentor" = $6, "educationMentor" = $7, "aboutMentor" = $8 WHERE id_mentor = $9 ;', [name, direction, experience, city, sex, age, education, about, userId]);

        await pool.query('DELETE FROM "interestsMentor" WHERE "mentor_id" = $1', [userId]);

        await interests.forEach((item) => {
            pool.query('insert into "interestsMentor" ("mentor_id", "interestMentor_id") VALUES ($1, $2) ', [userId, item]);
        });

        if (update.rowCount === 0) {

            throw new Error('Non-correct data');

        }

        res.json({message: 'Data updated.', status: 'ok'});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля ученика ' + e.message});
    }
});


//  /api/edit-data/infmentor
router.get('/infmentor', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;

        const data = await pool.query('SELECT "nameMentor", "directionMentor_id", "connectMentor","experienceMentor_id", "cityMentor_id", "sexMentor_id", "ageMentor", "educationMentor", "aboutMentor", "interestMentor_id"\n' +
            'FROM mentor, "interestsMentor" ' +
            'WHERE mentor."id_mentor" = $1 ' +
            'AND "interestsMentor".mentor_id = $1 ;', [userId]);

        let mentor = {};

        for (item of data.rows) {

            if (!mentor.nameMentor) {

                mentor = {...item, interests: [item.interestMentor_id]}
            }
            else {

                mentor.interests.push(item.interestMentor_id);
            }

        }

        if (data.rowCount === 0) {

            throw new Error('No data found');
        }

        res.json(mentor);

    }
    catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке ред информации о ученике ' + e.message});
    }
});


module.exports = router;
