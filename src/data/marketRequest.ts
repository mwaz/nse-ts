import * as fs from 'fs';
import  * as puppeteer from 'puppeteer';

let browser; 
let page; 

export const appLogin = async() => {
    browser = await puppeteer.launch({defaultViewport: { width: 1024, height: 720 }, args: ['--start-fullscreen', '--window-size=1920,1040']});
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1040 });
    await page.goto('https://onlinetrading.ncbagroup.com/Tradeweb/login.aspx');
    await page.$('#txtLogin');
    await page.type('#txtLogin', process.env.USERNAME);
    await page.type('#txtPassword', process.env.PASSWORD);
    await page.click('#btnLogin');
    await page.waitForResponse(response => response.url() === 'https://onlinetrading.ncbagroup.com/Tradeweb/lareq.aspx' && response.status() === 200);
}

export const writeData = async(path, data,) => {
    await fs.writeFile(path, data, err => {
        err ?  console.log('Error writing file', err) :  console.log('Successfully wrote file')
    });
}

export const getIframeData = async(page) => {
    const frame = await page.frames().find(frame => frame.name() === 'iMarketDetailsFrame');
    let optionsResult = [];
    let resultsObject = [];

    for(let i=1; i<60; i++){
        optionsResult = await frame.$$eval(`#trMW_${i}`, (options:any) => options.map(option => option.textContent));
        await resultsObject.push(optionsResult);
    }
    return resultsObject;
}

const fetchData = (async () => {
    await appLogin();
    const resultsObject = await getIframeData(page);
    await writeData('./nse.json', resultsObject);
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
    await console.log(resultsObject);
  })();

  export default fetchData;