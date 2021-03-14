const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const uploader = require('../middleware/upload.middleware');
const pool = require('../pool');


const router = Router();


// /api/add/photo
router.post('/photo', authMiddleware, uploader.single('image'), async (req, res) => {
    try{

        const userId = req.user.userId;

        if (!req.file){
            return res.status(400).json({message: 'Неккоректное фото'});
        }

        const filename = req.file.filename;

        await pool.query("UPDATE student SET photo = $1 WHERE id_student = $2;", [filename, userId]);

        res.status(201).json('photo added');

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так в блоке добавления фото ' + e.message})
    }
});


module.exports = router;
