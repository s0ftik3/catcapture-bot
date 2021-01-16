const User = require('../../database/models/User');
const config = require('../../config.json');
const mongoose = require('mongoose');

module.exports = () => async (ctx) => {

    let start_ts = new Date().getTime();

    let connection = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    try {

        if (ctx.from.id != config.admin) return;

        const usersNumber = await User.find().then(response => response.length);
        const dbConnectionStatus = connection[mongoose.connection.readyState];

        ctx.reply(`Users: ${usersNumber}\nConnection status: ${dbConnectionStatus}\nLatency: ${new Date().getTime() - start_ts}ms`);

    } catch (error) {

        // If error occured
        console.error(error);

    };

};