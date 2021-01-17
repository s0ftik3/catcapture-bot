const madeRequestRecently = new Set();
const banned = new Set();
const config = require('../config.js').bot;

let request = 0;

module.exports = (user) => {

    if (request > 10) {
     
        banned.add(user);
        setTimeout(() => {

            banned.delete(user);
            request = 0;

        }, config.ban);

    }

    if (banned.has(user)) {

        return { cooldown: false, banned: true };

    }

    if (madeRequestRecently.has(user)) {

        request++;
        return { cooldown: true, banned: false };

    } else {

        madeRequestRecently.add(user);
        request++;
        setTimeout(() => {

            madeRequestRecently.delete(user);
            request = 0;

        }, config.cooldown);

        return { cooldown: false, banned: false };

    }

}