const WebEye = require('../scripts/webeye');
const User = require('../database/models/User');
const sizeOf = require('image-size');
const cooldown = require('../scripts/cooldown');
const convertToHours = require('../scripts/convertToHours');
const config = require('../config.js').bot;

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

        // Shortcut to reply on the user's message.
        const replyTo = { reply_to_message_id: ctx.update.message.message_id };

        // Check if the user floods.
        let checkUser = cooldown(ctx.from.id);
        if (checkUser.banned) return ctx.replyWithMarkdown(ctx.i18n.t('service.banned', { hour: convertToHours(config.ban) }), replyTo);
        if (checkUser.cooldown) return ctx.replyWithMarkdown(ctx.i18n.t('service.is_on_cooldown'), replyTo);

        // Match an url and fix it if needed.
        const condition = (ctx.message.text > 32) ? ctx.message.text.slice(0, 64) + '...' : ctx.message.text;
        if (ctx.message.entities == undefined) return ctx.replyWithHTML(ctx.i18n.t('error.invalid_url', { invalid_link: condition }), replyTo);
        let url = ctx.message.entities.filter(e => e.type === 'url').map(e => e.url || ctx.message.text.slice(e.offset, (e.offset + e.length)));
        if (url.length >= 1) url = url[0];
        if (!url.toString().match(/^http([s]?):\/\/.*/)) url = 'http://' + url.toString().match(/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/)[0];

        // Match a user preferences.
        const device = ctx.session.userData.device;
        const fullPage = ctx.session.userData.fullPage;
        const sendDocument = ctx.session.userData.sendDocument;
        const sendPhoto = ctx.session.userData.sendPhoto;
        
        // Set all the user's preferences.
        const webeye = new WebEye({ fullPage: fullPage, device: device });

        // Start imitate uploading.
        (sendPhoto) ? ctx.replyWithChatAction('upload_photo') : ctx.replyWithChatAction('upload_document');

        // Log what url was requested.
        console.log(`${ctx.from.id}: requested ${url} website.`);

        // Get an image.
        webeye.getScreenshot(url).then(async response => {

            // Convert base64 to image & get its dimensions.
            const image = Buffer.from(response, 'base64');
            const dimensions = sizeOf(image);

            // According to the user's preferences send a respond.
            if (sendPhoto) {

                // Telegram has limits so check it.
                if ((dimensions.height + dimensions.width) > 10000) {

                    // Send waiting message & Start uploading a document.
                    let messageToDelete;
                    ctx.replyWithMarkdown(ctx.i18n.t('service.image_too_long')).then(data => messageToDelete = data.message_id);
                    ctx.replyWithChatAction('upload_document');
                    return ctx.replyWithDocument({ source: image, filename: `${config.filename}.png` }, replyTo).then(() => ctx.deleteMessage(messageToDelete)); // Delete waiting message.

                }

                await ctx.replyWithPhoto({ source: image }, replyTo).then(data => {

                    if (sendDocument) {

                        const replyToMyself = { reply_to_message_id: data.message_id };

                        ctx.replyWithChatAction('upload_document');
                        ctx.replyWithDocument({ source: image, filename: `${config.filename}.png` }, replyToMyself);

                    }

                });

            } else {

                ctx.replyWithChatAction('upload_document');
                ctx.replyWithDocument({ source: image, filename: `${config.filename}.png` }, replyTo);

            }

        }).catch(err => {

            const replyTo = { reply_to_message_id: ctx.update.message.message_id };

            // If the website is down.
            if (err.message.match('NOT_RESOLVED')) return ctx.replyWithMarkdown(ctx.i18n.t('error.website_down'), replyTo);
                else if (err.message.match('CONTAIN_IP_ADDRESS')) ctx.replyWithMarkdown(ctx.i18n.t('error.ip_address'));
                else if (err.message.match('timeout')) ctx.replyWithMarkdown(ctx.i18n.t('error.timeout'));
                else ctx.replyWithMarkdown(ctx.i18n.t('error.other')), console.error(err);
                
        });

    } catch (err) {

        // In case of any other issues.
        ctx.replyWithMarkdown(ctx.i18n.t('error.other'));
        console.error(err);

    }

};