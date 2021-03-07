const express = require('express');
const config = require('config');


const app = express();

const PORT = config.get('port') || 5000;

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/order-student', require('./routes/order-student.routes'));
app.use('/api/order-mentor', require('./routes/order-mentor.routes'));
app.use('/api/edit-data', require('./routes/edit-data'));

async function start() {
    try{

        app.listen(PORT, () => console.log(`App has been started on port ${config.get('port')}`));

    }catch (e) {
        console.log('Server error in app block,' + e.message);
        process.exit(1);
    }

};

start();
