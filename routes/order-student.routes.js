const pool = require("../pool");
const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const RoomChat = require('../models/RoomChat.model.js');


const router = Router();


// /api/order-student/create
router.post('/create', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",];

        const date = new Date();

        const datetime = `${date.getDate()} ${months[date.getMonth()]} в ${date.getHours()}:${date.getSeconds()}`

         const { direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions } = req.body;

        const order = await pool.query(
            'INSERT INTO "order" ' +
            '("student_id", "direction_id", "experience_id", "city_id", "sex_id", "type_id", "priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions", "datetime") ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)' +
            'RETURNING * ;',
            [userId, direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions, datetime]);

        if (order.rowCount > 0) {

            res.status(201).json(order.rows[0].id_order);
        }
        else {

            throw new Error();
        }

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
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions", "datetime" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" ' +
            'WHERE "order".student_id = $1 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[userId]);

            res.json(orders.rows);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех заявок студента ' + e});
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
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions", "datetime" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" ' +
            'WHERE "order".student_id = $1 ' +
            'AND "order".id_order = $2 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[userId, orderId]);

        if (order.rowCount > 0) {

            res.json(order.rows[0]);
        }
        else {

            throw new Error('No data found');
        }


    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения заявки студента ' + e});
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

        if (uninvitings.rowCount > 0) {

            console.log(uninvitings.rows);

            uninvitings.rows.map( (uninviting) => {

                respondMentors.rows.map( (respondMentor, index) => {

                    // console.log(respondMentor.id_mentor, respondMentor.nameMentor, orderId);

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
            'SELECT "id_order", "id_mentor", "id_response", "emailMentor", "photoMentor", "nameMentor", "direction", "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor", "invited", "interest", "id_response" ' +
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


        const liked = await pool.query(
            'select "mentor_id" from "likedStudent" ' +
            'where "likedStudent"."student_id" = $1 ' +
            'and "likedStudent"."mentor_id" = $2', [userId, mentorId]);

        if (liked.rows[0] && data.rows[0].id_mentor === liked.rows[0].mentor_id) {

            data.rows[0].liked = true;
        }

        if (!data.rows[0]) {

            throw new Error('No data found');
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

       console.log('idResponse:',idResponse, "mentorId:",mentorId, "orderId:", orderId);

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

        const userId = req.user.userId;

        const orderId = req.body.orderId;

        console.log({userId, orderId});

        await pool.query(
            'delete from "order" ' +
            'where "order"."id_order" = $1 ' +
            'and "order"."student_id" = $2;', [orderId, userId]);

        await pool.query(
        'delete from "likedStudent" ' +
        'where "likedStudent"."order_id" = $1;', [orderId]);

        res.json({message: 'Заявка удалена'});

    }catch (e){
        res.status(500).json('Что-то пошгло не так при удалении заявки ' + e.message);
    }
});


module.exports = router;


