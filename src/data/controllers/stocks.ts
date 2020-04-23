import Stocks from '../models/stocks';

export default class StocksController {

async saveStocks(stocks) {
    // console.log(stocks, 'stocks')

    // const { stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold }  = stocks;

    const newStockObject = await Stocks.create({
        stocks
        // stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold
    });
    // stocks.save();

    // return res.status(201).jsend.success({ stocks: newStockObject });
}
}