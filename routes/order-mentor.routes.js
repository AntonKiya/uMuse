const {Router} = require('express');
const pool = require('../pool');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();


// /api/order-mentor/suitable0rders
router.get('/suitable0rders', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor'){
            return res.status(401).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orders = await pool.query(
        'SELECT "id_order", "student_id","direction", "experience", "city", "sex","type" ,"price", "ageFrom", "ageTo", "suggestions", "datetime" ' +
        'FROM "order", "direction", "experience", "city", "sex", "type", "mentor" ' +
        'WHERE "mentor".id_mentor = $1 ' +
        'AND "mentor"."directionMentor_id" = "order".direction_id AND "order".direction_id = "direction".id_direction ' +
        'AND "mentor"."experienceMentor_id" = "order".experience_id AND "order".experience_id = "experience".id_experience ' +
        'AND "mentor"."cityMentor_id" = "order".city_id AND "order".city_id = "city".id_city ' +
        'AND "mentor"."sexMentor_id" = "order".sex_id AND "order".sex_id = "sex".id_sex AND mentor."ageMentor" >= "order"."ageFrom" ' +
        'AND mentor."ageMentor" <= "order"."ageTo" AND "type".id_type = "order".type_id ORDER BY "id_order" DESC ;', [userId]);

        const uninvitings = await pool.query('SELECT * from "uninvitingMentor" where "uninvitingMentor"."mentor_id" = $1;', [userId]);

        if (uninvitings.rowCount !== 0) {

            uninvitings.rows.map( (uninviting) => {

                orders.rows.map( (order, index) => {

                    if (order.id_order === uninviting.order_id) {

                        orders.rows.splice(index,1);
                    }
                });
            });

        }

        const liked = await pool.query(
            'SELECT "order_id" ' +
            'FROM "likedMentor"' +
            'WHERE "likedMentor"."mentor_id" = $1;', [userId]);

        for (ordrItem of orders.rows) {

            const order = ordrItem;

            for (likedItem of liked.rows) {

                if(order.id_order === likedItem.order_id) {

                    order.liked = 'true';
                }
            }

        }

        for(item of orders.rows) {

            const result = await pool.query(
            'SELECT "invited", "id_response" ' +
            'FROM "responses"' +
            'WHERE "responses"."order_id" = $1' +
            'AND "responses"."mentor_id" = $2;', [item.id_order, userId]);

            if(result.rows[0]) {

                item.id_response = result.rows[0].id_response

                item.invited = result.rows[0].invited;

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
        return res.status(500).json('Что то пошло не так при запросе подходящих заявок.', e.message);
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

        const result = await pool.query(
        'SELECT "id_response", "invited" ' +
        'FROM "responses"' +
        'WHERE "responses"."order_id" = $1' +
        'AND "responses"."mentor_id" = $2;', [idOrder, userId]);

        if(!result.rows[0]) {

            const order = await pool.query(
                'SELECT "id_order", "student_id", "direction", "experience", "city", "sex","type" ,"price", "ageFrom", "ageTo", "suggestions", "datetime" ' +
                'FROM "mentor", "order","direction", "experience", "city", "sex", "type"' +
                'WHERE id_order = $1 ' +
                'AND id_mentor = $2 ' +
                'AND "order".direction_id = "direction".id_direction ' +
                'AND "order".experience_id = "experience".id_experience ' +
                'AND "order".city_id = "city".id_city ' +
                'AND "order".sex_id = "sex".id_sex ' +
                'AND "order".type_id = "type".id_type ' +
                'AND "order".direction_id = "mentor"."directionMentor_id" ' +
                'AND "order".experience_id = "mentor"."experienceMentor_id" ' +
                'AND "order".city_id = "mentor"."cityMentor_id" ' +
                'AND "order".sex_id = "mentor"."sexMentor_id"; ' ,[idOrder, userId]);

            const liked = await pool.query(
                'select "order_id" from "likedMentor" ' +
                'where "likedMentor"."mentor_id" = $1 ' +
                'and "likedMentor"."order_id" = $2', [userId, idOrder]);

            if (liked.rows[0] && order.rows[0].id_order === liked.rows[0].order_id) {

                order.rows[0].liked = true;
            }

            if (order.rowCount === 0) {

                return res.status(400).json({message: 'Трунь...Ничего такого не нашлось'});
            }

            res.json(order.rows[0]);

        }
        else {

            const order = await pool.query(
                'SELECT "id_order", "student_id", "direction", "experience", "city", "sex","type" ,"price", "ageFrom", "ageTo", "suggestions", "datetime" ' +
                'FROM "order","direction", "experience", "city", "sex", "type"' +
                'WHERE id_order = $1 ' +
                'AND "order".direction_id = "direction".id_direction ' +
                'AND "order".experience_id = "experience".id_experience ' +
                'AND "order".city_id = "city".id_city ' +
                'AND "order".sex_id = "sex".id_sex ' +
                'AND "order".type_id = "type".id_type;',[idOrder]);

            const liked = await pool.query(
                'select "order_id" from "likedMentor" ' +
                'where "likedMentor"."mentor_id" = $1 ' +
                'and "likedMentor"."order_id" = $2', [userId, idOrder]);

            order.rows[0].id_response = result.rows[0].id_response;

            if (liked.rows[0] && order.rows[0].id_order === liked.rows[0].order_id) {

                order.rows[0].liked = 'true';
            }

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

            order.rows[0].invited = result.rows[0].invited;

            res.json(order.rows[0]);
        }

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
        'SELECT "id_student", "id_response", "emailStudent", "photoStudent", "connectStudent", "nameStudent", "city", "ageStudent", "aboutStudent", "interest" ' +
        'FROM "student", "responses", "order", "city", "interest", "interestsStudent" ' +
        'WHERE "student".id_student = $1 ' +
        'AND "responses"."order_id" = $2 ' +
        'AND "responses"."mentor_id" = $3 ' +
        'AND "responses"."invited" = \'true\' ' +
        'AND "interest"."id_interest" = "interestsStudent"."interestStudent_id" ' +
        'AND "interestsStudent"."student_id" = $1 ' +
        'AND "student"."cityStudent_id" = "city".id_city;', [studentId, orderId, userId]);

        if (data.rowCount === 0) {

            return res.status(400).json({message: 'Трунь...Ничего такого не нашлось'});
        }

        let student = {};

        for (item of data.rows) {

            const {id_student, interest, id_response, nameStudent, photoStudent, city, connectStudent, emailStudent, ageStudent, aboutStudent} = item;


            if (student.hasOwnProperty('interests')) {

                if (student.interests.indexOf(interest) === -1){

                    student.interests.push(interest);
                }
            }
        else {

                student = {id_student, nameStudent, id_response, photoStudent, city, emailStudent, connectStudent, ageStudent, interests: [interest], aboutStudent};
            }
        }

            res.json(student);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения профиля студента' + e});
    }
});

//\/
// /api/order-mentor/responses
router.get('/responses', authMiddleware, async (req,res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(401).json('У вас нет прав доступа');
        }

        const userId = req.user.userId;

        const responses = await pool.query(
        'SELECT "id_response", "order_id", "student_id","mentor_id", "direction", "experience", "city", "sex", type, "price", "ageFrom", "ageTo", suggestions ' +
        'FROM responses, direction, "order", "experience", city, sex, type ' +
        'WHERE "mentor_id" = $1 ' +
        'AND "order".id_order = "responses".order_id ' +
        'AND "direction".id_direction = "order".direction_id ' +
        'AND "experience".id_experience = "order".experience_id ' +
        'AND "city".id_city = "order".city_id ' +
        'AND "sex".id_sex = "order".sex_id ' +
        'AND "type".id_type = "order".type_id ORDER BY "id_response" DESC ;', [userId]);

        const liked = await pool.query(
            'SELECT "order_id" ' +
            'FROM "likedMentor"' +
            'where "likedMentor"."mentor_id" = $1;', [userId]);

        for (responseItem of responses.rows) {

            const response = responseItem;

            for (likedItem of liked.rows) {

                if(response.order_id === likedItem.order_id) {

                    response.liked = true;
                }
            }

        }

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

            item.invited = result.rows[0].invited;

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

        const respond = await pool.query('INSERT INTO "responses" ("order_id", "mentor_id") VALUES ($1, $2) RETURNING "id_response"', [orderId, mentorId]);

        if (respond.rowCount > 0) {

            res.status(201).json({id_order: orderId});
        }
        else {

            throw new Error();
        }

    }catch (e){
        return res.json('Что-то пошло не так в блоке откика на заявку' + e);
    }
});


module.exports = router;
