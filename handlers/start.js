const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => async (ctx) => {
    try {

        if (ctx.updateType == 'message') {

            User.find({ id: ctx.from.id }).then(response => {

                if (response.length <= 0) {

                    // Create an array for the future buttons.
                    const buttons = [];

                    // Locate locales folder.
                    const locales_folder = fs.readdirSync('./locales/');

                    // Create buttons of each localization.
                    locales_folder.forEach(file => {

                        let localization = file.split('.')[0];
                        buttons.push(
                            Markup.callbackButton(i18n.t(localization, 'language'), `setLang:${localization}`)
                        );
                        
                    });

                    // Message that user will see.
                    const message = '🌍 *Select interface language to continue:*';

                    // Respond user.
                    ctx.replyWithMarkdown(message, {
                        reply_markup: Markup.inlineKeyboard(buttons, { columns: 2 })
                    });

                } else {

                    ctx.i18n.locale(response[0].language);

                    // Respond user.
                    ctx.replyWithMarkdown(ctx.i18n.t('greeting', {
                        name: ctx.from.first_name
                    }), { 
                        reply_markup: Markup.inlineKeyboard([
                            [Markup.urlButton(
                                ctx.i18n.t('button.donate'),
                                `https://t.me/id160`
                            )]
                        ]
                      ) 
                    });

                }

            });

        } else if (ctx.updateType == 'callback_query') {

            const language = ctx.match[0].split(':')[1];

            ctx.i18n.locale(language);
            // Respond user.
            ctx.editMessageText(ctx.i18n.t('greeting', {
                name: ctx.from.first_name
            }),
            { 
                parse_mode: 'Markdown', 
                reply_markup: Markup.inlineKeyboard([
                    [Markup.urlButton(
                        ctx.i18n.t('button.donate'),
                        `https://t.me/id160`
                    )]
                ]
              ) 
            });
            ctx.answerCbQuery();

            ctx.replyWithMarkdown(ctx.i18n.t('first_try'), Markup
                .keyboard([
                    [ctx.i18n.t('button.settings')]
                ])
                .resize()
                .extra()
            );

            // Add user to the database.
            const userData = {
                id: ctx.from.id,
                firstName: (ctx.from.first_name == undefined) ? null : ctx.from.first_name,
                lastName: (ctx.from.last_name == undefined) ? null : ctx.from.last_name,
                username: (ctx.from.username == undefined) ? null : ctx.from.username,
                language: language,
                device: 0,
                fullPage: false,
                sendDocument: false,
                sendPhoto: true,
                timestamp: new Date()
            }
            ctx.session.userData = userData;
            const user = new User(userData);
            await user.save().then(() => console.log(`${ctx.from.id}: user recorded.`));

        }

    } catch (err) {

        console.error(err);

    }
}