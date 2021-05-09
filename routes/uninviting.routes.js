const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const pool = require('../pool');


const router = Router();


//  /api/uninviting/uninvitingStudent
router.post('/uninvitingStudent', authMiddleware, async (req, res) => {
    try {

        const userId = req.user.userId;

        const {orderId, mentorId} = req.body;

        const status = await pool.query(
            'INSERT INTO "uninvitingStudent" ("order_id", "mentor_id", "student_id")' +
            'VALUES ($1, $2, $3) RETURNING "id_uninvitingStudent";', [orderId, mentorId, userId]);

        const result = await pool.query(
            'UPDATE "responses" SET "invited" = \'reject\' ' +
            'WHERE "responses"."order_id" = $1 ' +
            'AND "responses"."mentor_id" = $2 ' +
            'RETURNING "invited";', [orderId, mentorId]);

        if (status.rowCount === 0 || result.rowCount === 0) {

            throw new Error();
        }

        res.json({mentor_id: mentorId});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке отказа ментору ' + e.message});
    }
});


//  /api/uninviting/uninvitingMentor
router.post('/uninvitingMentor', authMiddleware, async (req, res) => {
    try {

        const userId = req.user.userId;

        const {orderId} = req.body;

        const status = await pool.query(
            'INSERT INTO "uninvitingMentor" ("order_id", "mentor_id")' +
            'VALUES ($1, $2) RETURNING "id_uninvitingMentor" ;', [orderId, userId]);

        await pool.query(
            'DELETE FROM "likedMentor" ' +
            'WHERE "likedMentor".order_id = $1 ' +
            'AND "likedMentor"."mentor_id" = $2 ', [orderId, userId]);


        if (status.rowCount === 0) {

            throw new Error();
        }

        res.json({order_id: orderId});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке скрытия заявки ' + e.message});
    }
});


module.exports = router;
