const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({

    destination(req, file, callback) {

        callback(null, 'uploads/');
    },
    filename(req, file, callback) {

        const data = moment().format('DDMMYYYY-HHmmss SSS');

        callback(null, `${data}-${file.originalname}`);
    },

});


const fileFilter = (req, file, callback) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){

        callback(null, file);
    }else {

        callback(null, false);
    }
};

const uploader = multer({

    storage: storage,

    fileFilter: fileFilter,
});


module.exports = uploader;
