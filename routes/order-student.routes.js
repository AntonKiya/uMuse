const pool = require("../pool");
const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const RoomChat = require('../models/RoomChat.model.js');


const router = Router();


// /api/order-student/create
router.post('/create',
    [
        check('ageFrom', 'некорректный возраст').isInt({min: 0}).notEmpty(),
        check('ageTo', 'некорректный возраст').isInt({min: 1}).notEmpty(),
    ],
    authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {

            return res.status(400).json({
                validationErrors: validationErrors.array(),
                message: `Некорректные данные: ${validationErrors.array()[0].msg}`
            });
        }

        const userId = req.user.userId;

        const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",];

        const date = new Date();

        const datetime = `${date.getDate()} ${months[date.getMonth()]} в ${date.getHours()}:${date.getSeconds()}`

         const { direction_id, experience_id, city_id, sex_id, type_id, price, ageFrom, ageTo, suggestions } = req.body;



        const order = await pool.query(
            'INSERT INTO "order" ' +
            '("student_id", "direction_id", "experience_id", "city_id", "sex_id", "type_id", "price", "ageFrom", "ageTo", "suggestions", "datetime") ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)' +
            'RETURNING * ;',
            [userId, direction_id, experience_id, city_id, sex_id, type_id, price, ageFrom, ageTo, suggestions, datetime]);

        if (order.rowCount === 0) {

            throw new Error('No data Found')
        }

        res.status(201).json(order.rows[0].id_order);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке создания заявки ' + e.message});
    }
});



// /api/order-student/allOrdersS
router.get('/allOrdersS', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'})
        }

        const userId = req.user.userId;

        const orders = await pool.query(
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"price", "ageFrom", "ageTo", "suggestions", "datetime" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" ' +
            'WHERE "order".student_id = $1 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[userId]);

            res.json(orders.rows);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех заявок ученика ' + e});
    }
});



// /api/order-student/oneOrderS
router.get('/oneOrderS/:idApp', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const userId = req.user.userId;
        const orderId = req.params.idApp;

        const order = await pool.query(
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"price", "ageFrom", "ageTo", "suggestions", "datetime" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" ' +
            'WHERE "order".student_id = $1 ' +
            'AND "order".id_order = $2 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[userId, orderId]);

        if (order.rowCount === 0) {

            return res.status(400).json({message: 'Трунь...Ничего такого не нашлось'});
        }

        res.json(order.rows[0]);


    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения заявки ученика ' + e});
    }
});


// /api/order-student/allResponses
router.post('/allResponses', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orderId = +req.body.orderId;

        const status = await pool.query('SELECT * FROM "order" WHERE "order"."student_id" = $1 AND "order"."id_order" = $2 ', [userId, orderId]);

        if (status.rowCount === 0) {

            return res.status(400).json({message: 'Трунь...Ничего такого не нашлось'});
        }

        const respondMentors = await pool.query(
            'SELECT "id_order", "id_mentor", "id_response", "photoMentor","emailMentor", "nameMentor", "direction", "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor", "invited" ' +
            'FROM "mentor", "responses", "order", "direction", "experience", "city", "sex" ' +
            'WHERE "responses"."order_id" = $1' +
            'AND "mentor"."id_mentor" = "responses"."mentor_id" ' +
            'AND "order"."id_order" = "order_id"' +
            'AND "order"."student_id" = $2' +
            'AND "mentor"."directionMentor_id" = "direction"."id_direction" ' +
            'AND "mentor"."experienceMentor_id" = "experience"."id_experience" ' +
            'AND "mentor"."experienceMentor_id" = "experience"."id_experience" ' +
            'AND "mentor"."cityMentor_id" = "city"."id_city" ' +
            'AND "mentor"."sexMentor_id" = "sex"."id_sex" ' +
            'AND "mentor"."sexMentor_id" = "sex"."id_sex" ORDER BY "id_response" DESC ;', [orderId, userId]);

        const uninvitings = await pool.query('select * from "uninvitingStudent" where "uninvitingStudent"."order_id" = $1 and "uninvitingStudent"."student_id" = $2;', [orderId, userId]);

        if (uninvitings.rowCount !== 0) {

            uninvitings.rows.map( (uninviting) => {

                respondMentors.rows.map( (respondMentor, index) => {

                    if ( respondMentor.id_mentor === uninviting.mentor_id && uninviting.order_id === orderId ) {

                        respondMentors.rows.splice(index,1);
                    }
                });
            });

        }

        const liked = await pool.query(
            'SELECT "mentor_id" ' +
            'FROM "likedStudent" ' +
            'WHERE "likedStudent"."student_id" = $1;', [userId]);

        for (mentorItem of respondMentors.rows) {

            const mentor = mentorItem;

            for (likedItem of liked.rows) {

                if (likedItem.mentor_id === mentor.id_mentor) {

                    mentor.liked = true;
                }

            }

        }

        res.json(respondMentors.rows);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех отликнувшихся на заявку ' + e.message});
    }
});



// /api/order-student/oneResponse
router.post('/oneResponse', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const {mentorId, orderId} = req.body;

        const data = await pool.query(
            'SELECT "id_order", "id_mentor", "id_response", "emailMentor", "photoMentor", "nameMentor", "direction", "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor", "connectMentor", "invited", "interest", "id_response" ' +
            'FROM "mentor", "responses", "order", "direction", "experience", "city", "sex", "interestsMentor", "interest" ' +
            'WHERE "mentor".id_mentor = $1 ' +
            'AND "responses".mentor_id = $1 ' +
            'AND "responses"."order_id" = $2 ' +
            'AND "order"."student_id" = $3 ' +
            'AND "responses"."order_id" = "order"."id_order" ' +
            'AND "mentor"."directionMentor_id" = "direction".id_direction ' +
            'AND "interest"."id_interest" = "interestsMentor"."interestMentor_id" ' +
            'AND "interestsMentor"."mentor_id" = $1 ' +
            'AND "mentor"."experienceMentor_id" = "experience".id_experience ' +
            'AND "mentor"."cityMentor_id" = "city".id_city ' +
            'AND "mentor"."sexMentor_id" = "sex".id_sex ', [mentorId, orderId, userId]);

        if (data.rowCount === 0) {

            return res.status(400).json({message: 'Трунь...Ничего такого не нашлось'});
        }

        const liked = await pool.query(
            'select "mentor_id" from "likedStudent" ' +
            'where "likedStudent"."student_id" = $1 ' +
            'and "likedStudent"."mentor_id" = $2', [userId, mentorId]);

        if (liked.rows[0] && data.rows[0].id_mentor === liked.rows[0].mentor_id) {

            data.rows[0].liked = true;
        }

        let mentor = {};

        for (item of data.rows) {

            const {id_mentor, interest, photoMentor,id_response, sex, nameMentor, city, connectMentor, emailMentor, ageMentor, aboutMentor, experience, educationMentor, invited, liked, direction} = item;

            if (mentor.hasOwnProperty('id_mentor')) {

                mentor.interests.push(interest);
            }
            else {

                mentor = {id_mentor, interests: [interest], photoMentor,nameMentor,city, id_response, sex,emailMentor,connectMentor,ageMentor,aboutMentor,experience,educationMentor, invited, liked, direction};
            }
        }

        res.json(mentor);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения профиля откликнувшегося на заявку ментору' + e});
    }
});



// /api/order-student/invite
router.patch('/invite', authMiddleware, async (req, res) => {
   try {

       if (req.user.role !== 'student') {
           return res.status(403).json({message: 'У вас нет прав достпа'});
       }
       const userId = req.user.userId;

       const orderId = req.body.orderId;

       const idResponse = req.body.idResponse;

       const mentorId = req.body.mentorId;

       const result = await pool.query(
           'UPDATE "responses" SET "invited" = \'true\' ' +
           'WHERE "responses"."order_id" = $1 ' +
           'AND "responses"."mentor_id" = $2 ' +
           'RETURNING "invited";', [orderId, mentorId]);

       await pool.query('INSERT INTO roomchat ("response_id", "student_id", "mentor_id") VALUES ($1, $2, $3);', [idResponse, userId, mentorId]);

       const roomchatM = new RoomChat({idResponse: idResponse});

       await roomchatM.save();

       if(result.rows[0].invited) {

           res.json({mentor_id: mentorId, response_id: idResponse});
       }
       else {

           throw new Error('No data found');
       }



   }catch(e){
       res.status(500).json({message: 'Что-то пошло не так в блоке приглашения ментора за заявку' + e});
   }
});


router.post('/deleteOrder', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orderId = req.body.orderId;

        const responses = await pool.query(
            'SELECT "id_response" FROM "responses" WHERE "order_id" = $1;', [orderId]);

        await pool.query(
            'DELETE FROM "noticeMentor" where data = $1' +
            'AND ("noticeTypeMentor_id" = 2 or "noticeTypeMentor_id" = 4);', [orderId]);

        await pool.query('delete from "noticeStudent" where data = $1' +
            'and "noticeTypeStudent_id" = 1;', [orderId]);

        const noticesMessagesMentor = await pool.query(
            'select DISTINCT "data" from "noticeMentor", "order", "roomchat", "responses", "noticeType" ' +
            'WHERE "noticeType"."noticeType" = \'message\' ' +
            'AND "noticeType"."id_noticeType" = "noticeMentor"."noticeTypeMentor_id" ' +
            'AND "responses".order_id = "order".id_order ' +
            'AND "order".id_order = $1 ' +
            'AND "data" = responses.id_response;', [orderId]);

        for (notice of noticesMessagesMentor.rows) {

            await pool.query("DELETE FROM \"noticeMentor\" WHERE data = $1", [notice.data]);
        }

        const noticesMessagesStudent = await pool.query(
            'select DISTINCT "data" from "noticeStudent", "order", "roomchat", "responses", "noticeType"\n' +
            'WHERE "noticeType"."noticeType" = \'message\' ' +
            'AND "noticeType"."id_noticeType" = "noticeStudent"."noticeTypeStudent_id" ' +
            'AND "responses".order_id = "order".id_order ' +
            'AND "order".id_order = $1 ' +
            'AND "data" = responses.id_response order by "data";', [orderId]);

        for (notice of noticesMessagesStudent.rows) {

            await pool.query('DELETE FROM "noticeStudent" WHERE data = $1', [notice.data]);
        }

        for (item of responses.rows) {

            RoomChat.findOneAndRemove({idResponse: {$eq: item.id_response}}, function (err) {

                if (err) throw new Error('Ошибка при удалении сообщения.');
            });

        }

        await pool.query(
            'DELETE FROM "order" ' +
            'WHERE "order"."id_order" = $1 ' +
            'AND "order"."student_id" = $2;', [orderId, userId]);

        res.json({message: 'Заявка удалена'});

    }catch (e){
        res.status(500).json('Что-то пошгло не так при удалении заявки ' + e.message);
    }
});


module.exports = router;


