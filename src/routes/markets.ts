import { Router, Request, Response, NextFunction} from 'express';
// const Markets = require('../data/marketRequest');
import  * as puppeteer from 'puppeteer';

import fetchData from '../data/marketRequest';

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
    return fetchData;
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