const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => async (ctx) => {
    try {

        // Check if data is lost and if so - get it.
        if (ctx.session.userData == undefined) {
            await User.find({ id: ctx.from.id }).then(response => {
                ctx.session.userData = response[0];
            });
        }

        // Set language.
        ctx.i18n.locale(ctx.session.userData.language);

        // List of devices.
        const devices = {
            0: ctx.i18n.t('device.pc'),
            1: ctx.i18n.t('device.laptop'),
            2: ctx.i18n.t('device.iphoneX'),
            3: ctx.i18n.t('device.iphone5')
        };

        // Check type of request.
        if (ctx.updateType == 'message') {

            ctx.replyWithMarkdown(ctx.i18n.t('service.settings_msg'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(
                        ctx.i18n.t('button.language', {
                            lang_code: (ctx.session.userData.language == 'en') ? '🇬🇧' : '🇷🇺'
                        }),
                        'language'
                    )],
                    [Markup.callbackButton(
                        ctx.i18n.t('button.sendPhoto', {
                            sendPhoto_sign: (ctx.session.userData.sendPhoto) ? '✅' : '❌'
                        }),
                        'sendPhoto'
                    )],
                    [Markup.callbackButton(
                        ctx.i18n.t('button.sendDocument', {
                            sendDocument_sign: (ctx.session.userData.sendDocument) ? '✅' : '❌'
                        }),
                        'sendDocument'
                    )],
                    [Markup.callbackButton(
                        ctx.i18n.t('button.fullPage', {
                            fullPage_sign: (ctx.session.userData.fullPage) ? '✅' : '❌'
                        }),
                        'fullPage'
                    )],
                    [Markup.callbackButton(
                        ctx.i18n.t('button.setDevice', {
                            setDevice_sign: devices[ctx.session.userData.device]
                        }),
                        'setDevice'
                    )]
                ])
            });

        } else {

            const action = ctx.match;

            switch (action) {

                case 'language':
                    User.find({ id: ctx.from.id }).then(response => {

                        const language = response[0].language;
        
                        ctx.i18n.locale(language);
        
                        const buttons = [];
        
                        const locales_folder = fs.readdirSync('./locales/');
        
                        locales_folder.forEach(file => {
        
                            let localization = file.split('.')[0];
                            buttons.push(
                                Markup.callbackButton(i18n.t(localization, 'language'), `setLangCustom:${localization}`)
                            );
                                    
                        });
        
                        ctx.editMessageText(ctx.i18n.t('service.select_interface_lang'), {
                            parse_mode: 'Markdown',
                            reply_markup: Markup.inlineKeyboard(buttons.filter(e => e.callback_data != `setLangCustom:${language}`), { columns: 2 })
                        });
        
                    });
                    ctx.answerCbQuery();

                    break;
                
                case 'sendPhoto':
                    User.find({ id: ctx.from.id }).then(response => {

                        const sendDocumentCondition = response[0].sendDocument;
                        const currentCondition = response[0].sendPhoto; // true = send, false = not send.
                        const changeTo = (currentCondition) ? false : true;

                        if (sendDocumentCondition == false && changeTo == false) return ctx.answerCbQuery(ctx.i18n.t('error.docpic'));

                        User.updateOne({ id: ctx.from.id }, { $set: { sendPhoto: changeTo } }, () => {});
                        ctx.session.userData.sendPhoto = changeTo;
        
                        ctx.editMessageText(ctx.i18n.t('service.settings_msg'), {
                            parse_mode: 'Markdown',
                            reply_markup: Markup.inlineKeyboard([
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.language', {
                                        lang_code: (response[0].language == 'en') ? '🇬🇧' : '🇷🇺'
                                    }),
                                    'language'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendPhoto', {
                                        sendPhoto_sign: (currentCondition) ? '❌' : '✅' 
                                    }),
                                    'sendPhoto'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendDocument', {
                                        sendDocument_sign: (response[0].sendDocument) ? '✅' : '❌'
                                    }),
                                    'sendDocument'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.fullPage', {
                                        fullPage_sign: (response[0].fullPage) ? '✅' : '❌'
                                    }),
                                    'fullPage'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.setDevice', {
                                        setDevice_sign: devices[response[0].device]
                                    }),
                                    'setDevice'
                                )]
                            ])
                        });

                        ctx.answerCbQuery();

                    });
                    break;

                case 'sendDocument':
                    User.find({ id: ctx.from.id }).then(response => {

                        const sendPhotoCondition = response[0].sendPhoto;
                        const currentCondition = response[0].sendDocument; // true = send, false = not send.
                        const changeTo = (currentCondition) ? false : true;

                        if (sendPhotoCondition == false && changeTo == false) return ctx.answerCbQuery(ctx.i18n.t('error.docpic'));

                        User.updateOne({ id: ctx.from.id }, { $set: { sendDocument: changeTo } }, () => {});
                        ctx.session.userData.sendDocument = changeTo;
        
                        ctx.editMessageText(ctx.i18n.t('service.settings_msg'), {
                            parse_mode: 'Markdown',
                            reply_markup: Markup.inlineKeyboard([
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.language', {
                                        lang_code: (response[0].language == 'en') ? '🇬🇧' : '🇷🇺'
                                    }),
                                    'language'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendPhoto', {
                                        sendPhoto_sign: (response[0].sendPhoto) ? '✅' : '❌'
                                    }),
                                    'sendPhoto'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendDocument', {
                                        sendDocument_sign: (currentCondition) ? '❌' : '✅' 
                                    }),
                                    'sendDocument'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.fullPage', {
                                        fullPage_sign: (response[0].fullPage) ? '✅' : '❌'
                                    }),
                                    'fullPage'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.setDevice', {
                                        setDevice_sign: devices[response[0].device]
                                    }),
                                    'setDevice'
                                )]
                            ])
                        });

                        ctx.answerCbQuery();

                    });
                    break;

                case 'fullPage':
                    User.find({ id: ctx.from.id }).then(response => {

                        const currentCondition = response[0].fullPage; // true = send, false = not send.
                        const changeTo = (currentCondition) ? false : true;

                        User.updateOne({ id: ctx.from.id }, { $set: { fullPage: changeTo } }, () => {});
                        ctx.session.userData.fullPage = changeTo;
        
                        ctx.editMessageText(ctx.i18n.t('service.settings_msg'), {
                            parse_mode: 'Markdown',
                            reply_markup: Markup.inlineKeyboard([
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.language', {
                                        lang_code: (response[0].language == 'en') ? '🇬🇧' : '🇷🇺'
                                    }),
                                    'language'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendPhoto', {
                                        sendPhoto_sign: (response[0].sendPhoto) ? '✅' : '❌'
                                    }),
                                    'sendPhoto'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendDocument', {
                                        sendDocument_sign: (response[0].sendDocument) ? '✅' : '❌'
                                    }),
                                    'sendDocument'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.fullPage', {
                                        fullPage_sign: (currentCondition) ? '❌' : '✅' 
                                    }),
                                    'fullPage'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.setDevice', {
                                        setDevice_sign: devices[response[0].device]
                                    }),
                                    'setDevice'
                                )]
                            ])
                        });

                        ctx.answerCbQuery();

                    });
                    break;
                
                case 'setDevice':
                    User.find({ id: ctx.from.id }).then(response => {

                        const currentCondition = response[0].device; // 0 = pc, 1 = laptop, 2 = iPhone X, 3 = iPhone 5/SE
                        const changeTo = (currentCondition == 3) ? 0 : (currentCondition < 3) ? currentCondition + 1 : 0;

                        User.updateOne({ id: ctx.from.id }, { $set: { device: changeTo } }, () => {});
                        ctx.session.userData.device = changeTo;
        
                        ctx.editMessageText(ctx.i18n.t('service.settings_msg'), {
                            parse_mode: 'Markdown',
                            reply_markup: Markup.inlineKeyboard([
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.language', {
                                        lang_code: (response[0].language == 'en') ? '🇬🇧' : '🇷🇺'
                                    }),
                                    'language'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendPhoto', {
                                        sendPhoto_sign: (response[0].sendPhoto) ? '✅' : '❌'
                                    }),
                                    'sendPhoto'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.sendDocument', {
                                        sendDocument_sign: (response[0].sendDocument) ? '✅' : '❌'
                                    }),
                                    'sendDocument'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.fullPage', {
                                        fullPage_sign: (response[0].fullPage) ? '✅' : '❌'
                                    }),
                                    'fullPage'
                                )],
                                [Markup.callbackButton(
                                    ctx.i18n.t('button.setDevice', {
                                        setDevice_sign: devices[changeTo]
                                    }),
                                    'setDevice'
                                )]
                            ])
                        });

                        ctx.answerCbQuery();

                    });
                    break;

            }

        }

    } catch (err) {

        console.error(err);

    }
}