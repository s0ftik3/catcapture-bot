# Cat Capture Bot
[![release](https://img.shields.io/badge/release-v1.2.2-green.svg?style=flat-square)]()

Telegram description: 😺 Just a simple Telegram bot. 📸 I can capture screenshots of any website.

## About
😺 The idea is simple: you received some odd link and don't want to go for it, but you're curious what it is. You can just copy the link and send it to the bot, in a couple of seconds the bot will send you a screenshot of the given website.

## How it works
1) User passes a URL to the bot.
2) The bot checks if the URL valid.
3) If valid, it opens browser in headless mode and takes a screenshot.
4) Screenshot gets converted to base64.
5) According to the user's preferences (device, send photo or not, send document or not, full-page or not) send the result.

## Why is it "slow"?
According to my personal tests, the bot opens a website and takes a screenshot of it for 4 seconds. The actual reason is it waits for page load. So, it means unless the page is loaded, it won't take a screenshot of it. Therefore, if the webpage is heavy (lots of DOM elements) it will take much more time to load and take a screenshot. Also, once the screenshot is taken, the bot checks its dimensions, makes requests to the database (if needed) and if we put it all together we get another 1 second of time.
To conclude with, I don't think it's too slow. For some people to load a webpage would take much more time than for the bot to load and take a screenshot of it.

## Creating your bot
1) Create your own bot using [Bot Father](https://t.me/BotFather) and copy your brand-new bot's token.
2) Paste the token in `bot.js`. Replace `process.env.TOKEN` (2nd line) to your token.
3) The bot uses MongoDB. If you use another database providing platform, you should rewrite the code a little bit. However, if you use MongoDB as well as me, just replace `process.env.DATABASE` to your database URL in `database/connect.js` (4th line).
4) The bot runs on Heroku, so you need to set buildpacks as well for Puppeteer's proper work. Go to Settings > Buildpacks in your Heroku dashboard and set this link https://github.com/jontewks/puppeteer-heroku-buildpack.
5) Once you've done all those steps, you can launch your bot and enjoy it!

P.S. for those, who will run the bot on other platforms - https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

## Credits
- Author [s0ftik3](https://github.com/s0ftik3)
- Author on [Telegram](https://t.me/id160)
- A huge thanks to [ChiggerChug](https://github.com/ChiggerChug) for [their solution](https://github.com/puppeteer/puppeteer/issues/1718#issuecomment-397532083) to boost webpage load speed.