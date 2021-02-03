const pool = require("../pool");
const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();


// /api/order-student/create
router.post('/create', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;

         const { direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions } = req.body;

        await pool.query('INSERT INTO "order" ' +
            '("student_id", "direction_id", "experience_id", "city_id", "sex_id", "type_id", "priceFrom", "priceTo", "ageFrom", "ageTo", "suggestions") ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
            [userId, direction_id, experience_id, city_id, sex_id, type_id, priceFrom, priceTo, ageFrom, ageTo, suggestions]);

        res.status(201).json({message: 'Заявка успешно создана'});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке создания заявки ' + e.message});
    }
});



/// /api/order-student/allOrdersS
router.get('/allOrdersS', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;

        const orders = await pool.query("SELECT * FROM \"order\" WHERE student_id = $1",[userId]);

        res.json(orders.rows);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех заявок студента ' + e});
    }
});



/// /api/order-student/oneOrderS
router.get('/oneOrderS/:idApp', authMiddleware, async (req, res) => {
    try{

        if (req.user.role !== 'student') {
            return res.status(403).json('У вас нет прав доступа')
        }

        const userId = req.user.userId;
        const orderId = req.params.idApp;

        const order = await pool.query('SELECT * FROM "order" WHERE student_id = $1 AND id_order = $2 ;',[userId, orderId]);

        if (!order.rows[0]) {
            res.json({message: 'Заявка не найдена'});
        }

        res.json(order.rows[0]);

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке получения заявки студента'});
    }
});


module.exports = router;

