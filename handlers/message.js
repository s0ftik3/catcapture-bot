const WebEye = require('../scripts/webeye');
const User = require('../database/models/User');
const sizeOf = require('image-size');
const cooldown = require('../scripts/cooldown');
const config = require('../config.json');

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
        if (cooldown(ctx.from.id)) return ctx.replyWithMarkdown(ctx.i18n.t('is_on_cooldown'), replyTo);

        // Match an url.
        const url = ctx.message.text;

        // Match a user preferences.
        const device = ctx.session.userData.device;
        const fullPage = ctx.session.userData.fullPage;
        const sendDocument = ctx.session.userData.sendDocument;
        const sendPhoto = ctx.session.userData.sendPhoto;

        // Set all the user's preferences.
        const webeye = new WebEye({ fullPage: fullPage, device: device });

        // Check if the url is valid.
        const webpage = webeye.validateURL(url);
        if (!webpage.valid) return ctx.replyWithHTML(ctx.i18n.t('invalid_url', { invalid_link: url }), { reply_to_message_id: ctx.update.message.message_id });

        // Start imitate uploading.
        (sendPhoto) ? ctx.replyWithChatAction('upload_photo') : ctx.replyWithChatAction('upload_document');

        // Log what url was requested.
        console.log(`${ctx.from.id}: requested ${webpage.url} website.`);

        // Get an image.
        webeye.getScreenshot(webpage.url).then(async response => {

            // Convert base64 to image & get its dimensions.
            const image = Buffer.from(response, 'base64');
            const dimensions = sizeOf(image);

            // Telegram has limits so check it.
            if ((dimensions.height + dimensions.width) > 10000) {

                // Send waiting message & Start uploading a document.
                let messageToDelete;
                ctx.replyWithMarkdown(ctx.i18n.t('image_too_long')).then(data => messageToDelete = data.message_id);
                ctx.replyWithChatAction('upload_document');
                return ctx.replyWithDocument({ source: image, filename: `${config.filename}.png` }, replyTo).then(() => ctx.deleteMessage(messageToDelete)); // Delete waiting message.

            }

            // According to the user's preferences send a respond.
            if (sendPhoto) {

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
            if (err.message.match('NOT_RESOLVED')) return ctx.replyWithMarkdown(ctx.i18n.t('website_down'), replyTo);
                else ctx.replyWithMarkdown(ctx.i18n.t('error_msg')), console.error(err);
                
        });

    } catch (err) {

        // In case of any other issues.
        ctx.replyWithMarkdown(ctx.i18n.t('error_msg'));
        console.error(err);

    }

};