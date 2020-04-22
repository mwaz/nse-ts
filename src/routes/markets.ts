import { Router, Request, Response, NextFunction} from 'express';
const  marketsData  = require('../data-dump/nse.json');

import { 
  fetchData, 
  fetchSingleStock } from '../data/marketRequest';


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
    // await fetchData();
  }


  public getCurrrentData = async(req, res) => {
    // await res.send(marketsData);
    let result;
    try{
      result = await fetchData()
    }
    catch (e){ 
      console.log(e, 'data could not be refreshed')
    }
    finally{
      return result ? res.send(marketsData) : res.send({"message": "Data could not be refreshed"});
    }
    // await res.send(marketsData);
  }

  /**
   *Get a Single stock
   *
   * @memberof MarketsRouter
   */
  public getStock = async(req, res) => {
    const singleStock = await fetchSingleStock(req);
    await res.send(singleStock);
    // await fetchData;
  }

  public getTopGainers = async(req, res) => {
  
  }

  public getTopLosers = async(req, res) => {
    
  }

 
  // RATE LIMIT REQUESTS

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/data-refresh', this.getCurrrentData);
    this.router.get('/:stock', this.getStock);
  }

}

// Create the marketRouter, and export its configured Express.Router
const marketRoutes = new MarketsRouter();
marketRoutes.init();

export default marketRoutes.router;