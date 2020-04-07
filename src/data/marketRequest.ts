import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import Stocks from './models/stocks';

let browser;
let page;

export default class StockMarket {
    async appLogin() {
        browser = await puppeteer.launch({ defaultViewport: { width: 1024, height: 720 }, args: ['--start-fullscreen', '--window-size=1920,1040'] });
        page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1040 });
        await page.goto('https://onlinetrading.ncbagroup.com/Tradeweb/login.aspx');
        await page.$('#txtLogin');
        await page.type('#txtLogin', process.env.USERNAME);
        await page.type('#txtPassword', process.env.PASSWORD);
        await page.click('#btnLogin');
        await page.waitForResponse(response => response.url() === 'https://onlinetrading.ncbagroup.com/Tradeweb/lareq.aspx' && response.status() === 200);
    }

    async writeData(path, data) {
        await fs.writeFile(path, data, err => {
            err ? console.log('Error writing file', err) : console.log('Successfully wrote file')
        });
    }

    async getIframeData(page) {
        const frame = await page.frames().find(frame => frame.name() === 'iMarketDetailsFrame');
        let resultsObject: any = [];
        let stocksObject: any = {};
        let stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold;

        for (let i = 1; i < 60; i++) {
            stockName = await frame.$$eval(`#symbol_${i}`, (options: any) => options.map(option => option.title));
            stockTradingName = await frame.$$eval(`#symbol_${i}`, (options: any) => options.map(option => option.textContent));
            stockDemandQuantity = await frame.$$eval(`#bidqty_${i}`, (options: any) => options.map(option => option.textContent));
            stockDemandValue = await frame.$$eval(`#bidrate_${i}`, (options: any) => options.map(option => option.textContent));
            stockSupplyValue = await frame.$$eval(`#offrate_${i}`, (options: any) => options.map(option => option.textContent));
            stockSupplyQuantity = await frame.$$eval(`#offqty_${i}`, (options: any) => options.map(option => option.textContent));
            highestValueSold = await frame.$$eval(`#high_${i}`, (options: any) => options.map(option => option.textContent));
            lowestValueSold = await frame.$$eval(`#low_${i}`, (options: any) => options.map(option => option.textContent));

            resultsObject[i] = {
                [stockTradingName[0]]:
                {
                    stockName: stockName[0],
                    tradingName: stockTradingName[0],
                    demandQuantity: stockDemandQuantity[0],
                    demandValue: stockDemandValue[0],
                    supplyValue: stockSupplyValue[0],
                    supplyQuantity: stockSupplyQuantity[0],
                    highestValueSold: highestValueSold[0],
                    lowestValueSold: lowestValueSold[0],
                }

            }
        }
        return resultsObject;
    }

    async saveData(results) {
        for (let i = 0; i < results.length; i++) {
            try {
                let result = results[i].stockName
                result ? console.log(result, 'stockName') : console.log('stockName undefined')
                const newStockObject = await Stocks.create({
                    stockName: result, stockTradingName: results[i].stockTradingName, stockDemandQuantity: results[i].stockDemandQuantity, stockDemandValue: results[i].stockDemandValue, stockSupplyValue: results[i].stockSupplyValue, stockSupplyQuantity: results[i].stockSupplyQuantity, highestValueSold: results[i].highestValueSold, lowestValueSold: results[i].lowestValueSold,
                });

                return ({ stocks: newStockObject });
            }
            catch (e) {
                console.error(e.name + ': ' + e.message)
            }
        }
    }
}

const fetchData = (async () => {
    let stocks = new StockMarket
    await stocks.appLogin();
    const resultsObject = await stocks.getIframeData(page);
    const timeStamp = new Date();
    await stocks.writeData(__dirname + `/../data-dump/nse.json`, JSON.stringify(resultsObject));
    await stocks.writeData(__dirname + `/../data-backup/${timeStamp}_nse.json`, JSON.stringify(resultsObject));
    await stocks.saveData(resultsObject);
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
})();

const fetchSingleStock = async (stock) => {
    let stockData;
    const data = fs.readFileSync(__dirname + `/../data-dump/nse.json`, 'utf8');
   
    const res = JSON.parse(data);
    if (data) {
        res.forEach((element: any) => {
            const stocks = stock.params.stock.toUpperCase()
            if (typeof element === 'object' && element !== null) {
                for (var key in element) {
                    if (element.hasOwnProperty(key)) {
                        if (key === stocks) {
                            // console.log(element[key], 'keys');
                            stockData = element[key];
                            return stockData
                        }
                            return { message: 'No stock was found' };
                    }
                    return { message: 'No stock was found' };
                }
            }
        });
    }
     return stockData
}


export {
    fetchData,
    fetchSingleStock,
}