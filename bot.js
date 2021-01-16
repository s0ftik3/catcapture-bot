const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);
const session = require('telegraf/session');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const {
    connect
} = require('./database');

const {
    handleStart,
    handleMessage,
    handleLanguage,
    handleReset,
    handleSettings
} = require('./handlers');

bot.use(session());
bot.use(i18n.middleware());

// Beginning.
bot.start(handleStart());
bot.action(/setLang:\w+/, handleStart());

// Rest.
bot.hears(['⚙️ Settings', '⚙️ Настройки'], handleSettings());
bot.action('language', handleSettings());
bot.action('sendPhoto', handleSettings());
bot.action('sendDocument', handleSettings());
bot.action('fullPage', handleSettings());
bot.action('setDevice', handleSettings());
bot.command('help', handleStart());
bot.command('setlang', handleLanguage());
bot.command('reset', handleReset());
bot.action(/setLangCustom:\w+/, handleLanguage());

// Handling messages and callbacks.
bot.on('message', handleMessage());
bot.on('callback_query', (ctx) => ctx.answerCbQuery());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});