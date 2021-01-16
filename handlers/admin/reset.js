const User = require('../../database/models/User');
const config = require('../../config.json');

module.exports = () => async (ctx) => {

    try {

        if (ctx.from.id != config.admin) return;

        await User.deleteOne({ id: ctx.from.id });
        ctx.session.userData = undefined;

        ctx.reply('/start', { reply_markup: { remove_keyboard: true } });

    } catch (error) {

        // If error occured
        console.error(error);

    };

};