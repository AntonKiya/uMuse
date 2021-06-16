const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const uploader = require('../middleware/upload.middleware');
const {check, validationResult} = require('express-validator');
const pool = require('../pool');


const router = Router();


// /api/add/photo
router.post('/photo', authMiddleware, uploader.single('image'), async (req, res) => {
    try{

        const userId = req.user.userId;

        const userRole = req.user.role;

        if (!req.file){
            return res.status(400).json({message: 'Некорректное фото'});
        }

        const filename = req.file.filename;

        if (userRole === 'student') {

            console.log(0)

            await pool.query('UPDATE "student" SET "photoStudent" = $1 WHERE id_student = $2;', [filename, userId]);

        }
        else if (userRole === 'mentor') {

            console.log(1)

            await pool.query('UPDATE "mentor" SET "photoMentor" = $1 WHERE id_mentor = $2;', [filename, userId]);

        }

        res.status(201).json('photo added');


    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке добавления фото ' + e.message})
    }
});


module.exports = router;
