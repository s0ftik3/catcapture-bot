const mongoose = require('mongoose');

module.exports = () => { 
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        return console.log('Connected to the database.');
    });
}