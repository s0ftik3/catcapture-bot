const madeRequestRecently = new Set();
const config = require('../config.js').config;

module.exports = (user) => {

    if (madeRequestRecently.has(user)) {

        return true;

    } else {

        madeRequestRecently.add(user);
        setTimeout(() => {

            madeRequestRecently.delete(user);

        }, config.cooldown);

        return false;

    }

}