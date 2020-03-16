import { Router, Request, Response, NextFunction} from 'express';
// const Markets = require('../data/marketRequest');
import  * as puppeteer from 'puppeteer';
import * as fs from 'fs';


export class MarketsRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Markets.
   */
  public getAll(req, res) {
    return (async () => {
        const browser = await puppeteer.launch({defaultViewport: { width: 1024, height: 720 }, args: ['--start-fullscreen', '--window-size=1920,1040']});
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1040 });
        await page.goto('https://onlinetrading.ncbagroup.com/Tradeweb/login.aspx');
        await page.$('#txtLogin');
        await page.type('#txtLogin', process.env.USERNAME);
        await page.type('#txtPassword', process.env.PASSWORD);
        await page.click('#btnLogin');
        await page.waitForResponse(response => response.url() === 'https://onlinetrading.ncbagroup.com/Tradeweb/lareq.aspx' && response.status() === 200);
        const frame = await page.frames().find(frame => frame.name() === 'iMarketDetailsFrame');
        let optionsResult = [];
        let resulstsObject = [];

        for(let i=1; i<60; i++){
            optionsResult = await frame.$$eval(`#trMW_${i}`, (options:any) => options.map(option => option.textContent) );
            await resulstsObject.push(optionsResult);
            // await console.log(optionsResult);
        }
        await fs.writeFile('./nse.json', resulstsObject, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        });
        

        await page.screenshot({path: 'screenshot.png'});
        await browser.close();
        await console.log(resulstsObject);
      })();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
  }

}

// Create the marketRouter, and export its configured Express.Router
const marketRoutes = new MarketsRouter();
marketRoutes.init();

export default marketRoutes.router;