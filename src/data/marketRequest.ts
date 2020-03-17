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

export const writeData = async(path, data) => {
    await fs.writeFile(path, data, err => {
        err ?  console.log('Error writing file', err) :  console.log('Successfully wrote file')
    });
}

export const getIframeData = async(page) => {
    const frame = await page.frames().find(frame => frame.name() === 'iMarketDetailsFrame');
    let optionsResult = [];
    let resultsObject:any = [];
    // let stockName= []
    let stockObject:any = {}
    let stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold;

    for(let i=1; i<60; i++){
        stockName = await frame.$$eval(`#symbol_${i}`, (options:any) => options.map(option => option.title));
        stockTradingName = await frame.$$eval(`#symbol_${i}`, (options:any) => options.map(option => option.textContent));
        stockDemandQuantity = await frame.$$eval(`#bidqty_${i}`, (options:any) => options.map(option => option.textContent));
        stockDemandValue = await frame.$$eval(`#bidrate_${i}`, (options:any) => options.map(option => option.textContent));
        stockSupplyValue = await frame.$$eval(`#offrate_${i}`, (options:any) => options.map(option => option.textContent));
        stockSupplyQuantity = await frame.$$eval(`#offqty_${i}`, (options:any) => options.map(option => option.textContent));
        highestValueSold = await frame.$$eval(`#high_${i}`, (options:any) => options.map(option => option.textContent));
        lowestValueSold = await frame.$$eval(`#low_${i}`, (options:any) => options.map(option => option.textContent));

    // resultsObject[i] = {
    //     stockName: [
    //     tradingName: stockTradingName[0],
    //     demandQuantity: stockDemandQuantity[0],
    //     demandValue: stockDemandValue[0],
    //     supplyValue: stockDemandValue[0],
    //     supplyQuantity: stockSupplyQuantity[0],
    //     highestValueSold: highestValueSold[0] ,
    //     lowestValueSold: lowestValueSold[0],
    //     ]
    // }

    resultsObject[i] = [{
        stockName: stockName[0],
        tradingName: stockTradingName[0],
            demandQuantity: stockDemandQuantity[0],
            demandValue: stockDemandValue[0],
            supplyValue: stockDemandValue[0],
            supplyQuantity: stockSupplyQuantity[0],
            highestValueSold: highestValueSold[0] ,
            lowestValueSold: lowestValueSold[0],
    }]
    }
    console.log(resultsObject, 'res')
    return resultsObject;
}

const fetchData = (async () => {
    await appLogin();
    const resultsObject = await getIframeData(page);
    await writeData('./nse.json', JSON.stringify(resultsObject));
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
  })();

  export default fetchData;