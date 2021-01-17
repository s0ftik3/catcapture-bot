const Telegraf = require('telegraf');
const config = require('./config.js').config;
const bot = new Telegraf(config.token);
const session = require('telegraf/session');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const connect = require('./database/connect');

const {
    handleStart,
    handleMessage,
    handleLanguage,
    handleReset,
    handleSettings,
    handleDebug,
    handleCallback
} = require('./handlers');

bot.use(session());
bot.use(i18n.middleware());

bot.start(handleStart());
bot.action(/setLang:\w+/, handleStart());

bot.hears(['⚙️ Settings', '⚙️ Настройки'], handleSettings());
bot.action('language', handleSettings());
bot.action('sendPhoto', handleSettings());
bot.action('sendDocument', handleSettings());
bot.action('fullPage', handleSettings());
bot.action('setDevice', handleSettings());
bot.command('debug', handleDebug());
bot.command('reset', handleReset());
bot.action(/setLangCustom:\w+/, handleLanguage());

bot.on('message', handleMessage());
bot.on('callback_query', handleCallback());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});