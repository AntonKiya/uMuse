const {Router} = require('express');
const bcryptn = require('bcryptjs');
const config = require('config');
const jsonwebtoken = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const pool = require('../pool');

const router = Router();


// /api/auth/registerStudent
router.post(
    '/registerStudent',
    // array of validators.
    [
        check('email', 'Некорректный email').isEmail(),
        //WARNING: Сделать regex для имени!
        check('name', 'Некорректное имя').exists(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({min: 6}),
    ],
    async (req, res) => {
    try {

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);
            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {name, email, password} = req.body;

        const condidate = await pool.query(`SELECT * FROM student WHERE "emailStudent" = ($1)`, [email]);

        if (condidate.rows[0]) {
            return res.status(400).json({message: 'Студент с таким email уже существует'});
        }

        const hashedPassword = await bcryptn.hash(password, 12);

        await pool.query(`INSERT INTO student ("emailStudent","nameStudent","passwordStudent") values ($1, $2, $3)`, [email, name, hashedPassword]);

        res.status(201).json({message: 'Студент создан'});

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке регистрации студента: ' + e.message});
    }
});





// /api/auth/registerMentor
router.post('/registerMentor',
    [
        check('email', 'Некорректный email').isEmail(),
        check('name', 'Некорректное имя').exists(),
        check('direction', 'Неккоректное направление').isNumeric(),
        check('experience', 'Неккоректный опыт').isNumeric(),
        check('city', 'Неккоректный город').isNumeric(),
        check('sex', 'Неккоректный пол').isNumeric(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
    try {

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);
            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: 'Некорректные данные при регистрации'
            })
        };

        const {name, email, direction, experience, city, sex, password} = req.body;

        const condidate = await pool.query('SELECT * FROM mentor WHERE "emailMentor" = $1;', [email]);

        if (condidate.rows[0]){
            return res.status(400).json({messege: 'Ментор с таким email уже существует'});
        }

        const hashedPassword = await bcryptn.hash(password,12);

        await pool.query('INSERT INTO mentor ("emailMentor", "nameMentor", "directionMentor_id","experienceMentor_id", "cityMentor_id", "sexMentor_id", "passwordMentor")values ($1, $2, $3, $4, $5, $6, $7);', [email,name,direction,experience,city, sex,hashedPassword]);

        res.status(201).json({message: 'Ментор создан'});

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке регистрации ментора ' + e.message})
    }
});





// /api/auth/loginStudent
router.post('/loginStudent',async (req, res) => {
    try {

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке авторизациии студента'})
    }
});





// /api/auth/loginMentor
router.post('/loginMentor',async (req, res) => {
    try {

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке авторизация ментора'})
    }
});


module.exports = router;


