module.exports = {
    config: {
        "name": "Cat Capture",
        "bot": "@catcapturebot",
        "version": "1.3.0", 
        "token": process.env.TOKEN,
        "database": process.env.DATABASE, 
        "admin": 511695340, // Telegram ID.
        "filename": "@CatCaptureBot", // A user will see it when the bot sends a document.
        "cooldown": 4500 // in ms.
    },
    languages: {
        "en": "🇬🇧",
        "ru": "🇷🇺",
        "de": "🇩🇪"
    }
}