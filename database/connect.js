const mongoose = require('mongoose');
const config = require('../config.js').config;

module.exports = () => { 
    mongoose.connect(config.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        return console.log('Connected to the database.');
    });
}