import * as mongoose from 'mongoose';

const stocksSchema = new mongoose.Schema({
    stockName: {
       
    },
    tradingName: {
       
    },
    demandQuantity: {
       
    },
    demandValue: {
       
    },
    supplyValue: {
       
    },
    supplyQuantity: {
       
    },
    highestValueSold: {
        
    },
    lowestValueSold: {
       
    },
}, {
    timestamps: true
  });

 const Stocks = mongoose.model('Stocks', stocksSchema);
 export default Stocks;