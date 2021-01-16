module.exports = {
    handleStart: require('./start'),
    handleMessage: require('./message'),
    handleLanguage: require('./settings/language'),
    handleReset: require('./admin/reset'),
    handleSettings: require('./settings/settings')
}