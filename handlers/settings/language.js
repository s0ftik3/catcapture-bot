const User = require('../../database/models/User');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {

        const language = ctx.match[0].split(':')[1];
        ctx.i18n.locale(language);
        ctx.session.userData.language = language;

        // Update source language and edit message.
        await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {

            ctx.deleteMessage();

            ctx.replyWithMarkdown(ctx.i18n.t('service.language_changed'), Markup
                .keyboard([
                    [ctx.i18n.t('button.settings')]
                ])
                .resize()
                .extra()
            );

            ctx.answerCbQuery();

        });

    } catch (err) {

        console.error(err);

    }
}