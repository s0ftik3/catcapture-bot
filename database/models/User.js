const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: true
    },
    device: {
        type: Number,
        required: true
    },
    fullPage: {
        type: Boolean,
        required: true
    },
    sendDocument: {
        type: Boolean,
        required: true
    },
    sendPhoto: {
        type: Boolean,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);