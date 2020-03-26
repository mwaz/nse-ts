import Stocks from '../models/stocks';

export default class StocksController {

async saveStocks({stocks}, res) {

    const { stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold }  = stocks;

    const newStockObject = await Stocks.create({
        stockName, stockTradingName, stockDemandQuantity, stockDemandValue, stockSupplyValue, stockSupplyQuantity, highestValueSold, lowestValueSold
    });
    return res.status(201).jsend.success({ stocks: newStockObject })


}
}