import  * as puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({defaultViewport: { width: 1024, height: 720 }, args: ['--start-fullscreen', '--window-size=1920,1040']});
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1040 });
    await page.goto('https://onlinetrading.ncbagroup.com/Tradeweb/login.aspx');
    await page.$('#txtLogin');
    await page.type('#txtLogin', 'WAWERU');
    await page.type('#txtPassword', 'K9q4c4WcacDEZKK');
    await page.click('#btnLogin');
    await page.waitForResponse(response => response.url() === 'https://onlinetrading.ncbagroup.com/Tradeweb/lareq.aspx' && response.status() === 200);
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
  })();