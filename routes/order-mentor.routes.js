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

        const suitOrders = await pool.query('SELECT id_order, student_id, direction_id, experience_id, city_id, sex_id, type_id, "priceFrom", "priceTo","ageFrom", "ageTo", suggestions FROM "order", mentor WHERE mentor.id_mentor = $1 AND "order".direction_id = mentor."directionMentor_id" AND "order".city_id = mentor."cityMentor_id" AND "order".experience_id = mentor."experienceMentor_id" AND "order"."ageFrom" <= "mentor"."ageMentor" AND "order"."ageTo" >= "mentor"."ageMentor" AND "order".sex_id = mentor."sexMentor_id";', [userId]);

        if(suitOrders.rows.length === 0) {
            return res.json({message: 'Для вас пока нет подходящих заявок'});
        }

        res.json(suitOrders.rows);

    }catch (e){
        return res.status(500).json('Что то пошло не так при запросе подходящих заявок.');
    }
});



// /api/order-mentor/responses
router.get('/responses', authMiddleware, async (req,res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(401).json('У вас нет прав доступа');
        }

        const userId = req.user.userId;

        const responses = await pool.query('SELECT "id_response", "order_id" FROM responses WHERE "mentor_id" = $1;', [userId]);

        if (responses.rows.length === 0) {
            return res.json({message: 'Вы пока не откликнулись ни на одну заявку'});
        }

        res.json(responses.rows);

    }catch (e){
        return res.json('Что-то пошло не так в блоке получение ваших отликов ' + e);
    }
});



// /api/order-mentor/oneOrderM
router.get('/oneOrderM/:idOrder', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message:'У вас нет прав доступа'});
        }

        const orderId = req.params.idOrder;

        const order = await pool.query('SELECT "id_order", "direction", "experience", "city", "sex","type" ,"priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions" ' +
            'FROM "order", "direction", "experience", "city", "sex", "type" ' +
            'WHERE "order".id_order = $1 ' +
            'AND direction.id_direction = "order".direction_id ' +
            'AND experience.id_experience = "order".experience_id ' +
            'AND city.id_city = "order".city_id ' +
            'AND sex.id_sex = "order".sex_id ' +
            'AND type.id_type = "order".type_id;',[orderId]);

        if (!order.rows[0]) {
            res.json({message: 'Заявка не найдена'});
        }

        res.json(order.rows[0]);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке прсмотра конкретной заявки ' + e});
    }
});


module.exports = router;
