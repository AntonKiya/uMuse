const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const pool = require('../pool');

const router = Router();


//  /api/edit-data/editStudent
router.patch('/editStudent', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const {name, age, connect, about, interests} = req.body;

        const update = await pool.query('UPDATE "student" SET "nameStudent" = $1, "ageStudent" = $2, "connectStudent" = $3,"aboutStudent" = $4 WHERE "id_student" = $5;', [name, age, connect, about, userId]);

        await pool.query('DELETE FROM "interestsStudent" WHERE "student_id" = $1', [userId]);

        await interests.forEach((item) => {
            pool.query('insert into "interestsStudent" ("student_id", "interestStudent_id") VALUES ($1, $2) ', [userId, item]);
        });

        if (update.rowCount > 0) {

            res.json({message: 'Data updated.'});
        }
        else {

            throw new Error('Non-correct data');
        }

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля студента ' + e.message});
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

        if (data.rowCount > 0) {

            res.json(student);
        }
        else {

            throw new Error('No data found');
        }


    }
    catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке ред информации о студенте ' + e.message});
    }
});


//  /api/edit-data/editMentor
router.patch('/editMentor', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const {name, direction, experience, city, sex, age, education, about, interests} = req.body;

        const update = await pool.query('UPDATE "mentor" SET "nameMentor" = $1, "directionMentor_id" = $2, "experienceMentor_id" = $3, "cityMentor_id" = $4, "sexMentor_id" = $5, "ageMentor" = $6, "educationMentor" = $7, "aboutMentor" = $8 WHERE id_mentor = $9 ;', [name, direction, experience, city, sex, age, education, about, userId]);

        await pool.query('DELETE FROM "interestsMentor" WHERE "mentor_id" = $1', [userId]);

        await interests.forEach((item) => {
            pool.query('insert into "interestsMentor" ("mentor_id", "interestMentor_id") VALUES ($1, $2) ', [userId, item]);
        });

        if (update.rowCount > 0) {

            res.json({message: 'Data updated.'});
        }
        else {
            throw new Error('Non-correct data');
        }

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля студента ' + e.message});
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

        if (data.rowCount > 0) {

            res.json(mentor);
        }
        else {

            throw new Error('No data found');
        }

    }
    catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке ред информации о студенте ' + e.message});
    }
});


module.exports = router;
