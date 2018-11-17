const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    route: {type: Array, required: true},
});


module.exports = mongoose.model('chat', FileSchema);