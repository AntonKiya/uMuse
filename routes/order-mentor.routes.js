const {Router} = require('express');
const pool = require('../pool');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();


//                                  \/
// /api/order-mentor/suitable0rders
router.get('/suitable0rders', authMiddleware,async (req, res) => {
    try {

        if (req.user.role !== 'mentor'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orders = await pool.query(
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions"' +
            'FROM "order", "direction", "experience", "city", "sex", "type", "mentor" ' +
            'WHERE "mentor".id_mentor = $1 ' +
            'AND "mentor"."directionMentor_id" = "order".direction_id AND "order".direction_id = "direction".id_direction ' +
            'AND "mentor"."experienceMentor_id" = "order".experience_id AND "order".experience_id = "experience".id_experience ' +
            'AND "mentor"."cityMentor_id" = "order".city_id AND "order".city_id = "city".id_city ' +
            'AND "mentor"."sexMentor_id" = "order".sex_id AND "order".sex_id = "sex".id_sex AND mentor."ageMentor" >= "order"."ageFrom" ' +
            'AND mentor."ageMentor" <= "order"."ageTo" AND "type".id_type = "order".type_id;', [userId]);

        for(item of orders.rows) {

            const result = await pool.query(
                'SELECT "invited"' +
                'FROM "responses"' +
                'WHERE "responses"."order_id" = $1' +
                'AND "responses"."mentor_id" = $2;', [item.id_order, userId]);

            if(result.rows[0]) {

                if(result.rows[0].invited === 'true') {
                    const email = await pool.query(
                        'SELECT "id_student", "emailStudent" ' +
                        'FROM "student", "responses", "order"' +
                        'WHERE "order"."id_order" = $1' +
                        'AND "student"."id_student" = "order"."student_id" ' +
                        'AND "responses"."order_id" = "order"."id_order";', [item.id_order]
                    );

                    item.email = email.rows[0].emailStudent;

                }

            }

        };

        res.json(orders.rows);

    }catch (e){
        return res.status(500).json('Что то пошло не так при запросе подходящих заявок.');
    }
});



// /api/order-mentor/oneOrderM
router.get('/oneOrderM/:idOrder', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const idOrder = req.params.idOrder

        const order = await pool.query(
            'SELECT "id_order", "id_response","direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions" FROM "order","responses" ,"direction", "experience", "city", "sex", "type"' +
            'WHERE id_order = $1 ' +
            'AND "order".direction_id = "direction".id_direction ' +
            'AND "responses"."order_id" = $1 ' +
            'AND "responses"."mentor_id" = $2 ' +
            'AND "order".experience_id = "experience".id_experience ' +
            'AND "order".city_id = "city".id_city ' +
            'AND "order".sex_id = "sex".id_sex ' +
            'AND "order".type_id = "type".id_type;',[idOrder, userId]);

        console.log();

        const result = await pool.query(
            'SELECT "invited"' +
            'FROM "responses"' +
            'WHERE "responses"."order_id" = $1' +
            'AND "responses"."mentor_id" = $2;', [order.rows[0].id_order, userId]);

        if(result.rows[0]) {

            if(result.rows[0].invited === 'true') {
                const email = await pool.query(
                    'SELECT "id_student", "emailStudent" ' +
                    'FROM "student", "responses", "order"' +
                    'WHERE "order"."id_order" = $1' +
                    'AND "student"."id_student" = "order"."student_id" ' +
                    'AND "responses"."order_id" = "order"."id_order";', [order.rows[0].id_order]
                );

                order.rows[0].email = email.rows[0].emailStudent;

            }

        }

        res.json(order.rows[0]);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке прсмотра конкретной заявки ' + e});
    }
});

// /api/order-mentor/orderOwner
router.post('/orderOwner', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const {studentId, orderId} = req.body;

        const data = await pool.query(
            'SELECT "id_student", "emailStudent", "photoStudent", "connectStudent", "nameStudent", "city", "ageStudent", "aboutStudent", "interest" ' +
            'FROM "student", "city", "interest", "interestsStudent" ' +
            'WHERE "student".id_student = $1 ' +
            'AND "interest"."id_interest" = "interestsStudent"."interestStudent_id" ' +
            'AND "interestsStudent"."student_id" = $1 ' +
            'AND "student"."cityStudent_id" = "city".id_city;', [studentId]);

        let student = {};

        for (item of data.rows) {

            const {id_student, interest, nameStudent, photoStudent, city, connectStudent, emailStudent, ageStudent, aboutStudent} = item;


            if (student.hasOwnProperty('id_student')) {

                student.interests.push(interest);
            }
            else {

                student = {id_student, nameStudent, photoStudent, city, emailStudent, connectStudent, ageStudent, interests: [interest], aboutStudent};
            }
        }

        res.json(student);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения профиля студента' + e});
    }
});

//                              \/
// /api/order-mentor/responses
router.get('/responses', authMiddleware, async (req,res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(401).json('У вас нет прав доступа');
        }

        const userId = req.user.userId;

        const responses = await pool.query(
            'SELECT "id_response", "order_id", "mentor_id", "direction", "experience", "city", "sex", type, "priceFrom", "priceTo", "ageFrom", "ageTo", suggestions FROM responses, direction, "order", "experience", city, sex, type WHERE "mentor_id" = $1 AND "order".id_order = "responses".order_id AND "direction".id_direction = "order".direction_id AND "experience".id_experience = "order".experience_id AND "city".id_city = "order".city_id AND "sex".id_sex = "order".sex_id AND "type".id_type = "order".type_id;', [userId]);

        for(item of responses.rows) {


            const result = await pool.query(
                'SELECT "id_response", "invited"' +
                'FROM "responses"' +
                'WHERE "responses"."order_id" = $1' +
                'AND "responses"."mentor_id" = $2;', [item.order_id, userId]);


            if(result.rows[0].invited === 'true') {

                const email = await pool.query(
                    'SELECT "emailStudent" ' +
                    'FROM "student", "responses", "order"' +
                    'WHERE "order"."id_order" = $1' +
                    'AND "student"."id_student" = "order"."student_id" ' +
                    'AND "responses"."order_id" = "order"."id_order";', [item.order_id]
                );

                item.email = email.rows[0].emailStudent;

                item.id_response = result.rows[0].id_response;

            }

        };

        res.json(responses.rows);

    }catch (e){
        return res.json('Что-то пошло не так в блоке получение ваших отликов ' + e);
    }
});


// /api/order-mentor/respond
router.post('/respond', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(401).json('У вас нет прав доступа');
        }

        const mentorId = req.user.userId;

        const orderId = req.body.orderId;

        const result = await pool.query('SELECT * FROM "responses" WHERE "order_id" = $1 AND "mentor_id" = $2;', [orderId, mentorId]);

        if (result.rows[0]) {
            return res.status(200).json({message: 'Вы уже откликнулись на данную заявку'});
        }

        await pool.query('INSERT INTO "responses" ("order_id", "mentor_id") VALUES ($1, $2);', [orderId, mentorId]);

        res.status(201).json({message: 'Вы успешно отликнулись на заявку'});

    }catch (e){
        return res.json('Что-то пошло не так в блоке откика на заявку' + e);
    }
});


module.exports = router;
