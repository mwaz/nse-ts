import * as mongoose from 'mongoose';

const stocksSchema = new mongoose.Schema({
    stockName: {
        type: String
    },
    tradingName: {
        type: String
    },
    demandQuantity: {
        type: String
    },
    demandValue: {
        type: String
    },
    supplyValue: {
        type: String
    },
    supplyQuantity: {
        type: String
    },
    highestValueSold: {
        type: String
    },
    lowestValueSold: {
        type: String
    },
}, {
    timestamps: true
  });

 const Stocks = mongoose.model('Stocks', stocksSchema);
 export default Stocks;