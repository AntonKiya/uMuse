const {Router} = require('express');
const pool = require('../pool');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();


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

        const idOrder = req.params.idOrder

        const order = await pool.query(
            'SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions" FROM "order", "direction", "experience", "city", "sex", "type"' +
            'WHERE id_order = $1 ' +
            'AND "order".direction_id = "direction".id_direction ' +
            'AND "order".experience_id = "experience".id_experience ' +
            'AND "order".city_id = "city".id_city ' +
            'AND "order".sex_id = "sex".id_sex ' +
            'AND "order".type_id = "type".id_type;',[idOrder]);

        res.json(order.rows[0]);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке прсмотра конкретной заявки ' + e});
    }
});



// /api/order-mentor/responses
router.get('/responses', authMiddleware, async (req,res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(401).json('У вас нет прав доступа');
        }

        const userId = req.user.userId;

        const responses = await pool.query(
            'SELECT "id_response", "order_id", "mentor_id", "direction", "experience", "city", "sex", type, "priceFrom", "priceTo", "ageFrom", "ageTo", suggestions FROM responses, direction, "order", "experience", city, sex, type WHERE "mentor_id" = $1 AND "order".id_order = "responses".order_id AND "direction".id_direction = "order".direction_id AND "experience".id_experience = "order".experience_id AND "city".id_city = "order".city_id AND "sex".id_sex = "order".sex_id AND "type".id_type = "order".type_id;', [userId]);

        res.json(responses.rows);

    }catch (e){
        return res.json('Что-то пошло не так в блоке получение ваших отликов ' + e);
    }
});


module.exports = router;
