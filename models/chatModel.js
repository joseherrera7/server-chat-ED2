const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChatSchema = new Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    messages: {type: Array, required: true},
    token: {type: String, required: true},
});

module.exports = mongoose.model('chat', ChatSchema);