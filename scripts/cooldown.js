const madeRequestRecently = new Set();

module.exports = (user) => {

    if (madeRequestRecently.has(user)) {

        return true;

    } else {

        madeRequestRecently.add(user);
        setTimeout(() => {

            madeRequestRecently.delete(user);

        }, 4500);

        return false;

    }

}