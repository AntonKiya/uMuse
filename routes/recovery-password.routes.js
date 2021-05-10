const {Router} = require('express');
const nodemailer = require('nodemailer');
const pool = require('../pool');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const router = Router();

router.post('/reqoveryRequestStudent',
    [
        check('userEmail', 'Некорректный email').isEmail(),
        check('userPassword', 'Минимальная длинна пароля 6 символов').isLength({min: 6}),
    ],
    async (req, res) => {
    try {

        const {userEmail, userPassword} = req.body;

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {

            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: 'Некорректные данные при восстановлении пароля'
            });
        }

        const email = await pool.query(
            'SELECT "emailStudent" ' +
            'FROM "student" ' +
            'WHERE "student"."emailStudent" = $1 ', [userEmail]);

        if (email.rowCount === 0) {

            return res.status(400).json({message: 'Такого пользователя не сущетсвует'});
        }

        const code = Math.floor(Math.random() * (90001 - 10001 + 1)) + 10001;

        const hashPassword = await bcrypt.hash(userPassword, 12);

        const twins = await pool.query(
            'SELECT * FROM recoverystudent ' +
            'WHERE "emailStudent" = $1', [userEmail]);

        if (twins.rowCount !== 0) {

            res.status(400).json({message: 'Вы уже подали заявку на сброс пароля'});
        }

        const recoveryStatus = await pool.query(
            'INSERT INTO "recoverystudent" ("emailStudent", "passwordStudent", "codeStudent") ' +
            'VALUES ($1, $2, $3);', [userEmail, hashPassword, code]);

        if (recoveryStatus.rowCount === 0) {

            throw new Error();
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "umuse.noreply@gmail.com",
                pass: 'ZacaZaca335',
            },
        });

        let mailOptions = {
            from: "umuse.noreply@gmail.com",
            to: `${userEmail}`,
            subject: "Восстановление пароля uMuse",
            text: `Ваш секретный код для восстановления пароля ${code}`,
        };

        await transporter.sendMail(mailOptions,function(error, info){
            if (error) {

                res.status(400).json({message: error.message})
            }
            else {

                setTimeout(async () => {

                    await pool.query(
                        'DELETE FROM recoverystudent ' +
                        'WHERE "emailStudent" = $1;', [userEmail])

                }, 60000);

                res.status(200).json({message: info.messageId, status: 'ok'});
            }
        });

    }catch (e) {
        res.status(500).json({message: 'Что-то погло не так в блоке запроса на восстановление пароля студенту ' + e.message})
    }
});


router.post('/reqoveryStudent', async (req, res) => {
    try {

        const {userEmail, code} = req.body;

        const result = await pool.query(
            'SELECT "emailStudent", "passwordStudent", "codeStudent" ' +
            'FROM "recoverystudent" ' +
            'WHERE "emailStudent" = $1 ' +
            'AND "codeStudent" = $2; ', [userEmail, code]);

        if (result.rowCount === 0) {

            res.status(400).json({message: 'Неверный код'});
        }

        const studentEmail = result.rows[0].emailStudent;
        const passwordStudent = result.rows[0].passwordStudent;

        const update = await pool.query(
            'UPDATE "student" ' +
            'SET "passwordStudent" = $1 ' +
            'where "student"."emailStudent" = $2;', [passwordStudent, studentEmail]);

        if (update.rowCount === 0) {

            return res.status(400).json({message: 'Неверный код'});
        }

        res.json({message: 'Пароль был успешно изменен', status: 'ok'});

    }catch (e) {
        res.status(500).json({message: 'Что-то погло не так в блоке запроса на восстановление пароля студенту ' + e.message})
    }
});


router.post('/reqoveryRequestMentor',
    [
        check('userEmail', 'Некорректный email').isEmail(),
        check('userPassword', 'Минимальная длинна пароля 6 символов').isLength({min: 6}),
    ],
    async (req, res) => {
    try {

        const {userEmail, userPassword} = req.body;

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {

            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: 'Некорректные данные при восстановлении пароля'
            });
        }

        const email = await pool.query('SELECT "emailMentor" FROM "mentor" WHERE "mentor"."emailMentor" = $1 ', [userEmail]);

        if (email.rowCount === 0) {

            return res.status(400).json({message: 'Такого пользователя не сущетсвует'});
        }

        const code = Math.floor(Math.random() * (90001 - 10001 + 1)) + 10001;

        const hashPassword = await bcrypt.hash(userPassword, 12);

        const twins = await pool.query(
            'SELECT * FROM "recoveryMentor" ' +
            'WHERE "emailMentor" = $1', [userEmail]);

        if (twins.rowCount !== 0) {

            res.status(400).json({message: 'Вы уже подали заявку на сброс пароля'});
        }

        const recoveryStatus = await pool.query(
            'INSERT INTO "recoveryMentor" ("emailMentor", "passwordMentor", "codeMentor") ' +
            'VALUES ($1, $2, $3);', [userEmail, hashPassword, code]);

        if (recoveryStatus.rowCount === 0) {

            throw new Error();
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "umuse.noreply@gmail.com",
                pass: 'ZacaZaca335',
            },
        });

        let mailOptions = {
            from: "umuse.noreply@gmail.com",
            to: `${userEmail}`,
            subject: "Восстановление пароля uMuse",
            text: `Ваш секретный код для восстановления пароля ${code}`,
        };

        await transporter.sendMail(mailOptions,function(error, info){
            if (error) {

                res.status(400).json({message: error.message})
            }
            else {

                setTimeout(async () => {

                    await pool.query(
                        'DELETE FROM "recoveryMentor" ' +
                        'WHERE "emailMentor" = $1;', [userEmail])

                }, 60000);

                res.status(200).json({message: info.messageId, status: 'ok'});
            }
        });

    }catch (e) {
        res.status(500).json({message: 'Что-то погло не так в блоке запроса на восстановление пароля ментору ' + e.message})
    }
});


router.post('/reqoveryMentor', async (req, res) => {
    try {

        const {userEmail, code} = req.body;

        const result = await pool.query(
            'SELECT "emailMentor", "passwordMentor", "codeMentor" ' +
            'FROM "recoveryMentor" ' +
            'WHERE "emailMentor" = $1 ' +
            'AND "codeMentor" = $2; ', [userEmail, code]);

        if (result.rowCount === 0) {

            res.status(400).json({message: 'Неверный код'});
        }

        const mentorEmail = result.rows[0].emailMentor;
        const passwordMentor = result.rows[0].passwordMentor;

        const update = await pool.query(
            'UPDATE "mentor" ' +
            'SET "passwordMentor" = $1 ' +
            'where "mentor"."emailMentor" = $2;', [passwordMentor, mentorEmail]);

        if (update.rowCount === 0) {

            return res.status(400).json({message: 'Неверный код'});
        }

        res.json({message: 'Пароль был успешно изменен', status: 'ok'});

    }catch (e) {
        res.status(500).json({message: 'Что-то погло не так в блоке запроса на восстановление пароля студенту ' + e.message})
    }
});

module.exports = router;
