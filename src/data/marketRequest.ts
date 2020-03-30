import * as fs from 'fs';
import  * as puppeteer from 'puppeteer';
import Stocks from './models/stocks';

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
    let resultsObject:any = [];
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

    resultsObject[i] = {
        stockName: stockName[0],
        tradingName: stockTradingName[0],
            demandQuantity: stockDemandQuantity[0],
            demandValue: stockDemandValue[0],
            supplyValue: stockSupplyValue[0],
            supplyQuantity: stockSupplyQuantity[0],
            highestValueSold: highestValueSold[0] ,
            lowestValueSold: lowestValueSold[0],
    }
    }
    return resultsObject;
}

const saveData = async(results) => {

    for(let i=0; i<results.length; i++){
        try{
             results[i].stockName  ? console.log(results[i].stockName, 'stockName'): console.log('stockName undefined')
             const newStockObject = await Stocks.create({
                stockName: results[i].stockName, stockTradingName: results[i].stockTradingName, stockDemandQuantity: results[i].stockDemandQuantity, stockDemandValue: results[i].stockDemandValue, stockSupplyValue: results[i].stockSupplyValue, stockSupplyQuantity: results[i].stockSupplyQuantity, highestValueSold: results[i].highestValueSold, lowestValueSold: results[i].lowestValueSold
            });
            return ({ stocks: newStockObject });
        }
        catch(e){
            console.error(e.name + ': ' + e.message)
        }
      }

}


const fetchData = (async () => {
    await appLogin();
    const resultsObject = await getIframeData(page);
    const timeStamp = new Date();
    await writeData(__dirname + `/../data-dump/nse.json`, JSON.stringify(resultsObject));
    await writeData(__dirname + `/../data-backup/${timeStamp}_nse.json`, JSON.stringify(resultsObject));
    await saveData(resultsObject);
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
  })();

  export default fetchData;