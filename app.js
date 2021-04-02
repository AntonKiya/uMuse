const express = require('express');
const config = require('config');
const mongoose = require('mongoose');


const app = express();

const PORT = config.get('port') || 5000;

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/order-student', require('./routes/order-student.routes'));
app.use('/api/order-mentor', require('./routes/order-mentor.routes'));
app.use('/api/edit-data', require('./routes/edit-data'));
app.use('/api/add', require('./routes/add-photo.routes'));

async function start() {
    try{

        await mongoose.connect(config.get("mongoURI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true,
        });

        app.listen(PORT, () => console.log(`App has been started on port ${config.get('port')}`));

    }catch (e) {
        console.log('Server error in app block,' + e.message);
        process.exit(1);
    }

};

start();
