module.exports = {
    bot: {
        "name": "Cat Capture",
        "bot": "@catcapturebot",
        "version": "1.4.0", 
        "token": process.env.TOKEN,
        "database": process.env.DATABASE, 
        "admin": 511695340, // Telegram ID.
        "filename": "@CatCaptureBot", // A user will see it when the bot sends a document.
        "cooldown": 4500, // 4.5 seconds.
        "ban": 10800000 // 3 hours.
    },
    languages: {
        "en": "🇬🇧",
        "ru": "🇷🇺",
        "de": "🇩🇪"
    }
}