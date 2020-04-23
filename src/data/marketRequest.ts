import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import Stocks from './models/stocks';
import * as path from 'path';
import StocksController from './controllers/stocks';

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
            err ? console.log('Error writing file', err) : console.log(`Successfully wrote file  in ${path}`)
        });
    }

    // async checkExistentDirectory(dirname){
    //     if (!fs.existsSync(dirname)){
    //         await fs.writeFileSync(dirname, 'nah');
    //         // await fs.writeFileSync(dirname, 'naah');
    //     }
    // }

    async getIframeData(page) {
        const frame = await page.frames().find(frame => frame.name() === 'iMarketDetailsFrame');
        let resultsObject: any = [];
        let stocksObject: any = {};
        let stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold;

        for (let i = 1; i < 62; i++) {
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
            await Stocks.create({
                stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold,
            });
        }
        
        return resultsObject
    }

    async filterData (data) {

        let filtered = data.filter(function (el) {
            for (var key in el) {
               return key !== undefined || el !==null
            }

          });
        return filtered;
    }
}

const fetchData =  async () => {
    console.info('######### NOW FETCHING DATA #########');
    let stocks = new StockMarket;
    let stockdb = new StocksController;
    // const dataDirectory = `${__dirname}/../data-dump/nse.json`
    await stocks.appLogin();
    const resultsObject = await stocks.getIframeData(page);
    const filteredData = await stocks.filterData(resultsObject);
    const timeStamp = new Date();
    // await stocks.checkExistentDirectory(dataDirectory);
    await stocks.writeData(path.join(__dirname + `/../../src/data-dump/nse.json`), JSON.stringify(filteredData));
    await stocks.writeData(path.join(__dirname + `/../data-backup/${timeStamp}_nse.json`), JSON.stringify(filteredData));
    // await stocks.saveData(filteredData);
    // await stockdb.saveStocks(filteredData);
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
    console.info('######### FINISHED FETCHING DATA #########');
};

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
                            console.log(element[key], 'keys');
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