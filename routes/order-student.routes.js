const pool = require("../pool");
const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();


// /api/order-student/create
router.post('/create', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

         const { direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions } = req.body;

        const order = await pool.query(
            'INSERT INTO "order" ' +
            '("student_id", "direction_id", "experience_id", "city_id", "sex_id", "type_id", "priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions") ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)' +
            'RETURNING * ;',
            [userId, direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions]);

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
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions" ' +
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
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" WHERE "order".student_id = $1 ' +
            'AND "order".id_order = $2 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[userId, orderId]);

        if (!order.rows[0]) {
            res.json({message: 'Заявка не найдена'});
        }

        res.json(order.rows[0]);

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

        const orderId = req.body.orderId;

        const respondMentors = await pool.query(
            'SELECT "id_mentor", "emailMentor", "nameMentor", "direction", "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor" ' +
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
            'AND "mentor"."sexMentor_id" = "sex"."id_sex";', [orderId, userId]);

        res.json(respondMentors.rows);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех отликнувшихся на заявку'});
    }
});



// /api/order-student/oneResponse
router.post('/oneResponse', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const mentorId = req.body.mentorId;

        const respondMentor = await pool.query(
            'SELECT "id_mentor", "emailMentor", "nameMentor", "direction", "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor" ' +
            'FROM "mentor", "direction", "experience", "city", "sex" ' +
            'WHERE "mentor".id_mentor = $1 ' +
            'AND "mentor"."directionMentor_id" = "direction".id_direction ' +
            'AND "mentor"."experienceMentor_id" = "experience".id_experience ' +
            'AND "mentor"."cityMentor_id" = "city".id_city ' +
            'AND "mentor"."sexMentor_id" = "sex".id_sex;', [mentorId]);

        res.json(respondMentor.rows[0]);

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

       const orderId = req.body.orderId;

       const mentorId = req.body.mentorId;

       const result = await pool.query('UPDATE "responses" SET "invited" = true  WHERE "responses"."order_id" = $1 AND "responses"."mentor_id" = $2 RETURNING "invited";', [orderId, mentorId]);

       console.log(result.rows[0].invited)

       if(result.rows[0].invited) {

           res.json({message: 'Вы успешно пригласили ментора'});

       }

   }catch(e){
       res.status(500).json({message: 'Что-то пошло не так в блоке приглашения ментора за заявку' + e});
   }
});


module.exports = router;


