const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const pool = require('../pool');


const router = Router();

// /api/liked/allLikedStudent
router.get('/allLikedStudent', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const liked = await pool.query(
            'SELECT "id_response", "id_order", "direction_id", "suggestions", "invited", id_mentor, "emailMentor", "nameMentor", "interestMentor_id","interest","direction", "ageMentor",  "experience", "city", "sex", "ageMentor", "educationMentor", "aboutMentor", "photoMentor", "connectMentor", "likedStudent" ' +
            'FROM "mentor", "responses", "order", "likedStudent", "interestsMentor", interest, direction, experience, city, sex ' +
            'WHERE "order".student_id = $1 ' +
            'AND responses.order_id = "order".id_order ' +
            'AND mentor.id_mentor = responses.mentor_id ' +
            'AND "likedStudent"."student_id" = $1 ' +
            'AND mentor.id_mentor = "likedStudent"."mentor_id" ' +
            'AND mentor.id_mentor = "interestsMentor".mentor_id ' +
            'AND interest.id_interest = "interestsMentor"."interestMentor_id" ' +
            'AND mentor."directionMentor_id" = direction.id_direction ' +
            'AND mentor."experienceMentor_id" = experience.id_experience ' +
            'AND mentor."cityMentor_id" = city.id_city ' +
            'AND mentor."sexMentor_id" = sex.id_sex ;', [userId]);

        const likedUsers = [];

        for (likedUser of liked.rows) {

            const direction = await pool.query('SELECT "direction" FROM "direction", "order" WHERE "order"."direction_id" = "direction"."id_direction" AND "order"."id_order" = $1 ', [likedUser.id_order]);

            if (!likedUsers.find(item => item.emailMentor === likedUser.emailMentor)) {

                likedUsers.push({
                    id_response: likedUser.id_response,
                    order: [{ order:likedUser.id_order, suggestions: likedUser.suggestions, direction: direction.rows[0].direction }],
                    invited: likedUser.invited,
                    id_mentor: likedUser.id_mentor,
                    emailMentor: likedUser.emailMentor,
                    nameMentor: likedUser.nameMentor,
                    interestsMentor: [likedUser.interest],
                    directionMentor: likedUser.direction,
                    experienceMentor: likedUser.experience,
                    cityMentor: likedUser.city,
                    sexMentor: likedUser.sex,
                    ageMentor: likedUser.ageMentor,
                    educationMentor: likedUser.educationMentor,
                    aboutMentor: likedUser.aboutMentor,
                    photoMentor: likedUser.photoMentor,
                    connectMentor: likedUser.connectMentor,
                    likedStudent: likedUser.likedStudent
                });

            }
            else {

                const mentor = likedUsers.find(item => item.emailMentor === likedUser.emailMentor);

                if(!mentor.order.find(orderItem => orderItem.order === likedUser.id_order)) {

                    mentor.order.push({order:likedUser.id_order, suggestions: likedUser.suggestions, direction: direction.rows[0].direction});

                }

                if (mentor.interestsMentor.indexOf(likedUser.interest) === -1) {

                    mentor.interestsMentor.push(likedUser.interest)
                }

            }

        }

        res.json(likedUsers);

    }catch (e) {

        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех избранных менторов' + e.message})
    }
});


router.post('/studentLiked', authMiddleware,async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const mentorId = req.body.mentorId;

        const liked = await pool.query(
            'INSERT INTO "likedStudent" ("mentor_id", "student_id", "likedStudent")' +
            ' VALUES ($1, $2, \'true\');', [mentorId, userId]);

        if (liked.rowCount === 0) {

            throw new Error();
        }

        res.json({message: 'Liked'});

    } catch (e) {

        res.status(500).json({message: 'Что-то пошло не так в блоке добавления в избранное ментора ' + e.message});
    }
});


router.post('/studentUnliked', authMiddleware,async (req, res) => {
    try {

        if (req.user.role !== 'student') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const mentorId = req.body.mentorId;

        const deleted = await pool.query(
            'DELETE FROM "likedStudent" ' +
            'WHERE "likedStudent"."mentor_id" = $1 ' +
            'AND "likedStudent"."student_id" = $2', [mentorId, userId]);

        if (deleted.rowCount === 0) {

            throw new Error();
        }

        res.json({message: 'Unliked'});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке удаления в избранное ментора ' + e.message});
    }
});


router.get('/allLikedMentor', authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const liked = await pool.query(
            'SELECT "id_order", "direction", "experience", "city", "sex", "type", "price", "ageFrom", "ageTo", "suggestions", "datetime", "likedMentor"."likedMentor" as "liked" ' +
            'FROM "order", "likedMentor", direction, experience, city, sex, type ' +
            'WHERE "likedMentor"."mentor_id" = $1 ' +
            'AND "likedMentor"."order_id" = "order".id_order ' +
            'AND "order".direction_id = direction.id_direction ' +
            'AND "order".experience_id = experience.id_experience ' +
            'AND "order".city_id = city.id_city ' +
            'AND "order".sex_id = sex.id_sex ' +
            'AND "order".type_id = type.id_type ' +
            'AND "likedMentor"."order_id" = "order"."id_order" ' +
            'ORDER BY "id_likedMentor" DESC ;', [userId]);

        for(item of liked.rows) {

            const result = await pool.query(
                'SELECT "id_response", "invited" ' +
                'FROM "responses" ' +
                'WHERE "responses"."order_id" = $1 ' +
                'AND "responses"."mentor_id" = $2 ; ', [item.id_order, userId]);

            if (result.rows[0]) {

                item.id_response = result.rows[0].id_response;

                item.invited = result.rows[0].invited;

                if(result.rows[0].invited === 'true') {

                    const data = await pool.query(
                        'SELECT "emailStudent", "id_student" ' +
                        'FROM "student", "responses", "order"' +
                        'WHERE "order"."id_order" = $1' +
                        'AND "student"."id_student" = "order"."student_id" ' +
                        'AND "responses"."order_id" = "order"."id_order";', [item.id_order]
                    );

                    item.email = data.rows[0].emailStudent;

                    item.id_student = data.rows[0].id_student;

                }

            }

        };

        res.json(liked.rows);

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке получения всех избранных заявок ' + e.message})
    }
});


router.post('/mentorLiked', authMiddleware,async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orderId = req.body.orderId;

        const liked = await pool.query(
            'INSERT INTO "likedMentor" ("order_id", "mentor_id", "likedMentor") ' +
            'VALUES ($1, $2, \'true\');', [orderId,userId]);

        if (liked.rowCount === 0) {

            throw new Error();
        }

        res.json({message: 'liked'});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке добавления в избранное ментора ' + e.message});
    }
});


router.post('/mentorUnliked', authMiddleware,async (req, res) => {
    try {

        if (req.user.role !== 'mentor') {
            return res.status(403).json({message: 'У вас нет прав доступа'});
        }

        const userId = req.user.userId;

        const orderId = req.body.orderId;

        const deleted = await pool.query(
            'DELETE FROM "likedMentor" ' +
            'WHERE "likedMentor".order_id = $1 ' +
            'AND "likedMentor"."mentor_id" = $2 ', [orderId, userId]);

        if (deleted.rowCount === 0) {

            throw new Error();
        }

        res.json({message: 'unliked'});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так в блоке удаления в избранное ментора ' + e.message});
    }
});


module.exports = router;
