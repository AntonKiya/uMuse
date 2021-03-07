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

        const {nameStudent, ageStudent, aboutStudent} = req.body;

        const update = await pool.query('UPDATE "student" SET "nameStudent" = $1, "ageStudent" = $2, "aboutStudent" = $3 WHERE "id_student" = $4;', [nameStudent, ageStudent, aboutStudent, userId]);

        if (update.rowCount > 0) {
            res.json({message: 'Данные обновлены.'});
        }
        else {

            throw new Error('Non-correct data', 'edit-data.js');
        }

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля студента ' + e.message});
    }
});



//  /api/edit-data/editMentor
router.patch('/editMentor', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const {nameMentor, direction, experience, city, sex, ageMentor, educationMentor, aboutMentor} = req.body;

        const update = await pool.query('UPDATE "mentor" SET "nameMentor" = $1, "directionMentor_id" = $2, "experienceMentor_id" = $3, "cityMentor_id" = $4, "sexMentor_id" = $5, "ageMentor" = $6, "educationMentor" = $7, "aboutMentor" = $8 WHERE id_mentor = $9 ;', [nameMentor, direction, experience, city, sex, ageMentor, educationMentor, aboutMentor, userId]);

        if (update.rowCount > 0) {
            res.json({message: 'Данные обновлены.'});
        }
        else {
            throw new Error('Non-correct data', 'edit-data.js');
        }

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке обновления профиля студента ' + e.message});
    }
});


module.exports = router;
