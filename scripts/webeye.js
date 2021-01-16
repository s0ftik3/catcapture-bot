const puppeteer = require('puppeteer');

const devices = {
    0: { width: 1920, height: 1080 }, // FullHD PC
    1: { width: 1280, height: 720 }, // Laptop
    2: { width: 375, height: 812 }, // iPhone X
    3: { width: 320, height: 568 } // iPhone 5/SE
};

class WebEye {

    constructor (args = { width: Number, height: Number, device: Number, fullPage: Boolean }) {
        this.width = args.width,
        this.height = args.height,
        this.device = args.device,
        this.fullPage = args.fullPage  
    }

    /**
     * Validation of device's dimensions. The dimensions cannot be
     * less than 320px width and 568px height.
     * @public
     * @param {Number} width Device's screen width.
     * @param {Number} height Device's screen height.
     */
    validateDeviceDimensions(width, height) {

        // Check if dimensions less than the lowest available ones.
        if (width < 320 || height < 568) throw new Error('Failed validation: device dimensions cannot be less than 320px width and 568 height.');
            else return true;

    }

    /**
     * Validation of target url. It should have standart syntax. (i.e. starts with http(s)://)
     * @public
     * @param {String} url Target website's url.
     */
    validateURL(url) {

        if (url.match(/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/) == null) return { valid: false, url: url };

        if (!url.match(/^http([s]?):\/\/.*/)) url = 'http://' + url.match(/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/)[0];
    
        if (url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gmi)) return { valid: true, url: url }
            else return { valid: false, url: url} ;

    }

    /**
     * Get a screenshot of target website.
     * @public
     * @param {String} url Target website's url.
     */
    async getScreenshot(url) {

        // Validate width and height.
        this.validateDeviceDimensions(this.width || 1920, this.height || 1080);

        // Open browser & Set user preferences & Open target website & Take a screenshot
        const browser = await puppeteer.launch({ args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport(devices[this.device] || {
            width: this.width || 1920,
            height: this.height || 1080
        });
        await page.goto(url, {
            waitUntil: 'load',
            timeout: 0
        })

        // Take and convert screenshot into base64.
        const base64 = await page.screenshot({ encoding: 'base64', fullPage: this.fullPage || false });

        // Close browser.
        await browser.close();

        // Return an image in base64.
        return base64;

    }

}

module.exports = WebEye;