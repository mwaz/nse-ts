import { Router, Request, Response, NextFunction} from 'express';
const  marketsData  = require('../data-dump/nse.json');


import { fetchData, fetchSingleStock } from '../data/marketRequest';

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
  public getAll = async(req, res) => {
    await res.send(marketsData);
    await fetchData;

  }

  /**
   *Get a Single stock
   *
   * @memberof MarketsRouter
   */
  public getStock = async(req, res) => {
    const singleStock = await fetchSingleStock(req);
    await res.send(singleStock);
    await fetchData;

  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:stock', this.getStock);
  }

}

// Create the marketRouter, and export its configured Express.Router
const marketRoutes = new MarketsRouter();
marketRoutes.init();

export default marketRoutes.router;