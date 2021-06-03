const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jsonwebtoken = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const pool = require('../pool');

const router = Router();

// /api/auth/registerStudent
router.post(
    '/registerStudent',
    [
        check('email', 'некорректный email').isEmail(),
        check('name', 'некорректное имя').exists(),
        check('password', 'минимальная длинна пароля 6 символов').isLength({min: 6}),
    ],
    async (req, res) => {
        try {

            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {

                return res.status(400).json({
                    validationErrors: validationErrors.array(),
                    message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
                });
            }

            const {name, email, connect, interests, city, password} = req.body;

            if (interests.length === 0) {

                return res.status(400).json({message: 'Интересы должны содерать хотя бы один интерес'})
            }

            const condidate = await pool.query(`SELECT * FROM student WHERE "emailStudent" = ($1)`, [email]);

            if (condidate.rows[0]) {
                return res.status(400).json({message: 'Ученик с таким email уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const data = await pool.query(`INSERT INTO student ("emailStudent", "nameStudent", "connectStudent", "cityStudent_id","passwordStudent") values ($1, $2, $3, $4, $5) RETURNING "id_student";`, [email, name, connect, +city, hashedPassword]);

            const idStudent = data.rows[0].id_student;

            await interests.forEach((item) => {

                pool.query('INSERT INTO "interestsStudent" ("student_id", "interestStudent_id") values ($1, $2);', [idStudent, item]);
            });

            res.status(201).json({message: 'Ученик создан'});

        }catch (e) {
            res.status(500).json({message: 'Что-то пошло не так в блоке регистрации ученика: ' + e.message});
        }
    });

// /api/auth/registerMentor
router.post('/registerMentor',
    [
        check('email', 'некорректный email').isEmail(),
        check('name', 'некорректное имя').exists(),
        check('direction', 'неккоректное направление').isNumeric(),
        check('experience', 'неккоректный опыт').isNumeric(),
        check('city', 'неккоректный город').isNumeric(),
        check('age', 'неккоректный возраст').isInt({min: 6}),
        check('sex', 'неккоректный пол').isNumeric(),
        check('password', 'минимальная длинна пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
        try {

            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {

                return res.status(400).json({
                    validationErrors: validationErrors.array(),
                    message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
                })
            }

            const {name, email, connect, direction, experience, interests, city, sex, age, password} = req.body;

            if (interests.length === 0) {

                return res.status(400).json({message: 'Навыки должны содерать хотя бы один навык'})
            }

            const condidate = await pool.query('SELECT * FROM mentor WHERE "emailMentor" = $1;', [email]);

            if (condidate.rows[0]){
                return res.status(400).json({message: 'Ментор с таким email уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password,12);

            const data = await pool.query('INSERT INTO mentor ("emailMentor", "nameMentor", "connectMentor","directionMentor_id","experienceMentor_id", "cityMentor_id", "sexMentor_id", "ageMentor", "passwordMentor")values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id_mentor";', [email, name, connect, direction, experience, city, sex, age, hashedPassword]);

            const idMentor = data.rows[0].id_mentor;

            await interests.forEach((item) => {

                pool.query('INSERT INTO "interestsMentor" ("mentor_id", "interestMentor_id") values ($1, $2);', [idMentor, item]);
            });

            if (data.rowCount === 0) {

                throw new Error();
            }

            res.status(201).json({message: 'Ментор создан'});

        }catch (e) {
            res.status(500).json({message: 'Что-то пошло не так в блоке регистрации ментора ' + e.message})
        }
    });

// /api/auth/loginStudent
router.post('/loginStudent',
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'некорректный пароль').exists()
    ],
    async (req, res) => {
        try {

            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    validationErrors: validationErrors.array(),
                    message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
                });
            }

            const {email, password} = req.body;

            const condidate = await pool.query('SELECT * FROM student WHERE "emailStudent" = $1;', [email]);

            if (!condidate.rows[0]){
                return res.status(400).json({message: 'Такого ученика не существует, проверьте email'});
            }

            const passwordsMatch = await bcrypt.compare(password, condidate.rows[0].passwordStudent);

            if (!passwordsMatch) {
                return res.status(400).json({message: 'Неверный пароль'});
            }

            const token = jsonwebtoken.sign(
                {
                    userId: condidate.rows[0].id_student,
                    role: 'student',
                },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({ token: token, userId: condidate.rows[0].id_student, userRole: 'student' });

        }catch (e) {
            res.status(500).json({message: 'Что-то пошло не так в блоке авторизациии ученика'});
        }
    });

// /api/auth/loginMentor
router.post('/loginMentor',
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'некорректный пароль').exists(),
    ],
    async (req, res) => {
        try {

            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    validationErrors: validationErrors.array(),
                    message: `Некорректные данные: ${validationErrors.array()[0].msg}`,
                });
            }

            const {email, password} = req.body;

            const condidate = await pool.query('SELECT * FROM mentor WHERE "emailMentor" = $1;', [email]);

            if (!condidate.rows[0]) {
                return res.status(400).json({message: 'Такого ментора не существует, проверьте email'});
            }

            const passwordsMatch = await bcrypt.compare(password, condidate.rows[0].passwordMentor);

            if (!passwordsMatch) {
                return res.status(400).json({message: 'Неверный пароль'});
            }

            const token = jsonwebtoken.sign(
                {
                    userId: condidate.rows[0].id_mentor,
                    role: 'mentor',
                },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({ token, userId: condidate.rows[0].id_mentor, userRole: 'mentor' });

        }catch (e) {
            res.status(500).json({message: 'Что-то пошло не так в блоке авторизация ментора'})
        }
    });

module.exports = router;
