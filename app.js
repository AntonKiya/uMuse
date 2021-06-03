const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const pool = require('./pool');
const cors = require('cors');
const RoomChat = require('./models/RoomChat.model');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));
app.use('/api/order-student', require('./routes/order-student.routes'));
app.use('/api/order-mentor', require('./routes/order-mentor.routes'));
app.use('/api/edit-data', require('./routes/edit-data'));
app.use('/api/add', require('./routes/add-photo.routes'));
app.use('/api/uninviting', require('./routes/uninviting.routes'));
app.use('/api/liked', require('./routes/liked.routes'));
app.use('/api/recovery', require('./routes/recovery-password.routes'));

io.on('connection', (socket) => {

    socket.on('USER_JOIN', async (data) => {

        const {userId, userRole, roomId} = data;

        const users = await pool.query(
            'select "mentor_id", student_id ' +
            'from "responses", "order" ' +
            'where "id_response" = $1 ' +
            'and responses.order_id = "order".id_order;', [roomId]);

        const studentId = users.rows[0].student_id;

        const mentorId = users.rows[0].mentor_id;

        if ( (userRole === 'student' && studentId === userId) || (userRole === 'mentor' && mentorId === userId) ) {

        socket.join(data.roomId);

        const room = await RoomChat.findOne({idResponse: data.roomId});

        io.in(data.roomId).emit('GET_MESSAGES', room.messages);

        }
    });

    socket.on('NEW_MESSAGE', async (data) => {

        const {userId, userRole, roomId, message} = data;

        if (message.text) {


            const users = await pool.query(
                'select "mentor_id", student_id ' +
                'from "responses", "order" ' +
                'where "id_response" = $1 ' +
                'and responses.order_id = "order".id_order;', [roomId]);

            const studentId = users.rows[0].student_id;

            const mentorId = users.rows[0].mentor_id;

            if ((userRole === 'student' && studentId === userId) || (userRole === 'mentor' && mentorId === userId)) {

                await RoomChat.findOneAndUpdate({idResponse: roomId}, {$push: {messages: message}});

                const room = await RoomChat.findOne({idResponse: roomId});

                io.in(data.roomId).emit('SET_MESSAGES', room.messages[room.messages.length - 1]);

                if (userRole === 'mentor') {

                    const identical = await pool.query('select * from "noticeStudent" ' +
                        'where "noticeStudent"."student_id" = (select "student_id" from "order", "responses"\n' +
                        'where "responses"."id_response" = $1' +
                        'AND "order"."id_order" = "responses"."order_id") ' +
                        'and "noticeStudent"."data" = $2;', [roomId, roomId]);

                    if (identical.rowCount === 0) {

                        await pool.query(
                            'INSERT INTO "noticeStudent" ("student_id", data, "noticeTypeStudent_id") ' +
                            'VALUES ((SELECT "student_id" FROM "order", "responses" ' +
                            'WHERE "responses"."id_response" = $1 ' +
                            'AND "order"."id_order" = "responses"."order_id") , $1, (SELECT "id_noticeType" FROM "noticeType" WHERE "noticeType" = \'message\'));', [roomId]);

                        const notices = await pool.query(
                            'SELECT "id_noticeStudent", "student_id", "data", "noticeType" from "noticeStudent", "noticeType" ' +
                            'WHERE "noticeStudent"."student_id" = (SELECT "student_id" FROM "order", "responses" ' +
                            'WHERE "responses"."id_response" = $1 ' +
                            'AND "order"."id_order" = "responses"."order_id") ' +
                            'AND "noticeType"."id_noticeType" = "noticeStudent"."noticeTypeStudent_id";', [roomId]);

                        io.in(notices.rows[0].student_id).emit('SET_NOTICE', notices.rows);

                    }

                }

                if (userRole === 'student') {

                    const identical = await pool.query('select * from "noticeMentor" ' +
                        'where "noticeMentor"."mentor_id" = (select "mentor_id" from "responses" where "id_response" = $1) ' +
                        'and "noticeMentor"."data" = $2;', [roomId, roomId]);

                    if (identical.rowCount === 0) {

                        await pool.query(
                            'INSERT INTO "noticeMentor" ("mentor_id", data, "noticeTypeMentor_id")\n' +
                            'VALUES ((select "mentor_id" from "responses" where "responses"."id_response" = $1), $1, (SELECT "id_noticeType" FROM "noticeType" WHERE "noticeType" = \'message\'));', [roomId]);

                        const notices = await pool.query(
                            'SELECT "id_noticeMentor", "mentor_id", "data", "noticeType" from "noticeMentor", "noticeType" ' +
                            'WHERE "noticeMentor"."mentor_id" = (select "mentor_id" from "responses" where "responses"."id_response" = $1) ' +
                            'AND "noticeType"."id_noticeType" = "noticeMentor"."noticeTypeMentor_id";', [roomId]);

                        io.in(notices.rows[0].mentor_id).emit('SET_NOTICE', notices.rows);

                    }

                }

            }
        }

    });

    socket.on('GET_NOTICES', async (data) => {

        const {userId, userRole} = data;

        socket.join(userId);

        if (userRole === 'student') {

            const notices = await pool.query(
                'SELECT "id_noticeStudent", "data", "noticeType" from "noticeStudent", "noticeType" ' +
                'WHERE "noticeStudent"."student_id" = $1 ' +
                'AND "noticeType"."id_noticeType" = "noticeStudent"."noticeTypeStudent_id" ORDER BY "id_noticeStudent" DESC ;', [userId]);

            io.in(userId).emit('SET_NOTICE', notices.rows);

        }
        if (userRole === 'mentor') {

            const notices = await pool.query(
                'SELECT "id_noticeMentor", "mentor_id", "data", "noticeType" from "noticeMentor", "noticeType" ' +
                'WHERE "noticeMentor"."mentor_id" = $1 ' +
                'AND "noticeType"."id_noticeType" = "noticeMentor"."noticeTypeMentor_id" ORDER BY "id_noticeMentor" DESC ;', [userId]);

            io.in(userId).emit('SET_NOTICE', notices.rows);

        }

    });

    socket.on('DELETE_NOTICE', async (data) => {

        const {userId, userRole, id_notice} = data;

        if (userRole === 'student') {

            await pool.query(
                'DELETE FROM "noticeStudent" ' +
                'WHERE "student_id" = $1 ' +
                'AND "id_noticeStudent" = $2 ;', [userId, id_notice]);

            const notices = await pool.query(
                'SELECT "id_noticeStudent", "data", "noticeType" from "noticeStudent", "noticeType" ' +
                'WHERE "noticeStudent"."student_id" = $1 ' +
                'AND "noticeType"."id_noticeType" = "noticeStudent"."noticeTypeStudent_id";', [userId]);

            io.in(userId).emit('SET_NOTICE', notices.rows);

        }

        if (userRole === 'mentor') {

            await pool.query(
                'DELETE FROM "noticeMentor" ' +
                'WHERE "mentor_id" = $1 ' +
                'AND "id_noticeMentor" = $2 ;', [userId, id_notice]);

            const notices = await pool.query(
                'SELECT "id_noticeMentor", "data", "noticeType" from "noticeMentor", "noticeType" ' +
                'WHERE "noticeMentor"."mentor_id" = $1 ' +
                'AND "noticeType"."id_noticeType" = "noticeMentor"."noticeTypeMentor_id";', [userId]);

            io.in(userId).emit('SET_NOTICE', notices.rows);

        }

    });

    socket.on('NOTICE_MENTOR', async (data) => {

        const identical = await pool.query(
            'select "id_noticeStudent" from "noticeStudent" ' +
            'where "noticeStudent"."student_id" = (' +
            'SELECT "student_id" FROM "order" WHERE "order"."id_order" = $1) ' +
            'and "noticeStudent"."data" = $2 ;', [data.orderId, data.orderId]);

        if (identical.rowCount === 0) {

            await pool.query(
                'INSERT INTO "noticeStudent" (student_id, data, "noticeTypeStudent_id")' +
                'VALUES ((SELECT "student_id" FROM "order" ' +
                'WHERE "order"."id_order" = $1), $1, ' +
                '(select "id_noticeType" from "noticeType" where "noticeType" = $2));', [data.orderId, data.noticeType]);

            const notices = await pool.query(
                'SELECT "id_noticeStudent", "student_id", "data", "noticeType" from "noticeStudent", "noticeType" ' +
                'WHERE "noticeStudent"."student_id" = (select "student_id" from "order" where "order"."id_order" = $1) ' +
                'AND "noticeType"."id_noticeType" = "noticeStudent"."noticeTypeStudent_id";', [data.orderId]);

            io.in(notices.rows[0].student_id).emit('SET_NOTICE', notices.rows);

        }

    });

    socket.on('NOTICE_STUDENT', async (data) => {

        const identical = await pool.query(
            'SELECT "id_noticeMentor" from "noticeMentor" ' +
            'WHERE "noticeMentor"."mentor_id" = $1 ' +
            'AND "noticeMentor"."data" = $2;', [data.mentorId, data.orderId]);

        if (identical.rowCount === 0) {

            await pool.query(
                'INSERT INTO "noticeMentor" (mentor_id, data, "noticeTypeMentor_id")' +
                'VALUES ($1, $2,(select "id_noticeType" from "noticeType" where "noticeType" = $3));', [data.mentorId, data.orderId, data.noticeType]);

            const notices = await pool.query(
                'SELECT "id_noticeMentor", "mentor_id", "data", "noticeType" from "noticeMentor", "noticeType"\n' +
                'WHERE "noticeMentor"."mentor_id" = $1 ' +
                'AND "noticeType"."id_noticeType" = "noticeMentor"."noticeTypeMentor_id";', [data.mentorId]);

            io.in(notices.rows[0].mentor_id).emit('SET_NOTICE', notices.rows);

        }

    });

});

async function start() {
    try{

        await mongoose.connect(config.get("mongoURI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        });

        server.listen(PORT, () => console.log(`App has been started on port ${config.get('port')}`));

    }catch (e) {
        console.log('Server error in app block,' + e.message);
        process.exit(1);
    }

};

start();
