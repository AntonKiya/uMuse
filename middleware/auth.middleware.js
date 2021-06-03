const jwt = require('jsonwebtoken');
const config = require('config')


module.exports = (req, res, next) => {

    if (req.message === 'OPTIONS'){
        return next();
    }

    try{

        const token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN'

        if (!token) {
            return res.status(401).json({message: 'У вас нет авторизации '});
        }

        const decodedToken = jwt.verify(token, config.get('jwtSecret'));

        req.user = decodedToken;

        next();

    }catch (e){
        return res.status(401).json({message: 'У вас нет авторизации '});
    }

};
