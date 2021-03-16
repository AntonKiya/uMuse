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

        const user = await pool.query('SELECT "id_student", "emailStudent", "nameStudent", "ageStudent", "aboutStudent" FROM student WHERE "id_student" = $1', [userId]);

        if (!user.rows[0]) {
            return res.status(404).json({message: 'Пользователь не найден!'})
        }

        res.json({user: user.rows[0]});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке профиля студента'});
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

            const user = await pool.query('SELECT "id_mentor", "emailMentor","nameMentor" ,"ageMentor","educationMentor" ,"direction", "experience", "city", "sex","aboutMentor"\n' +
                'FROM mentor, direction, experience, city, sex ' +
                'WHERE mentor.id_mentor = $1' +
                'AND city."id_city" = mentor."cityMentor_id" ' +
                'AND direction."id_direction" = mentor."directionMentor_id" ' +
                'AND experience."id_experience" = mentor."experienceMentor_id" ' +
                'AND sex."id_sex" = mentor."sexMentor_id";', [userId]);

            if (!user.rows[0]) {
                return res.status(404).json({message: 'Пользователь не найден!'})
            }

            res.json({user: user.rows[0]});

        }catch (e){
            res.status(500).json({message: `Что-то пошло не так в блоке профиля ментора ${e}`});
        }
    });



//  /api/user/getPhoto
router.get('/getPhoto', authMiddleware, (req, res) => {
    try {

        const userId = req.user.userId;

        // Здесь должна быть проверка пренадлежит ли запрашиваемое
        // фото этому пользователю

        const {photo} = req.body;

        res.sendFile(`/Users/macbookpro/programming/Web/uMuse/uploads/${photo}`);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения фото ' + e.message});
    }
});


module.exports = router;
