const {Schema, model} = require('mongoose');

const schema = new Schema({
    idResponse: {type: Number},
    messages: {type: Array}
});

module.exports = model('RoomChat', schema);
