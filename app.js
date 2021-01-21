const express = require('express');
const config = require('config');


const app = express();

const PORT = config.get('port') || 5000;

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routs'));

async function start() {
    try{

        app.listen(PORT, () => console.log(`App has been started on port ${config.get('port')}`));

    }catch (e) {
        console.log('Server error in app block,' + e.message);
        process.exit(1);
    }

};

start();