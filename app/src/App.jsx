import React from 'react';
import './App.css';
import NavigationBar from './Navbar/Navbar';
import StockCard from './Cards/stocksCard';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      name: 'Waweru',
      card: 'Card 1',
      stocks: {}
    }
  }

  componentDidMount(){
    axios.get('http://localhost:3005/api/v1/stocks/').then( res => this.setState({stocks : res.data}))
  };

  getStocks = () => {
    const { stocks } = this.state;
    let stockData = [];
      for(let key in stocks ){
        const stockProperty = stocks[key];
        for(let key in stockProperty){
        if(Object.values(stockProperty[key]).length > 1) 
          stockData.push(stockProperty[key])
        }
      }
      return stockData;
  }


 render(){
    let stockData = this.getStocks();
    return (
      <div className="card-wrapper">
        <NavigationBar name={this.state.name} />
        <div>
        {stockData.map((stk) =>
          <StockCard key={stk.tradingName} name={stk.stockName} tradingName={stk.tradingName} children={
            <p>
            demandQuantity: {stk.demandQuantity} <br/>
            demandValue: {stk.demandValue} <br/> 
            supplyValue: {stk.supplyValue} <br/> 
            supplyQuantity: {stk.supplyQuantity} <br/> 
            highestValueSold: {stk.highestValueSold} <br/> 
            lowestValueSold: {stk.lowestValueSold} <br/> 
            </p>
          }/>
        )}
        </div>




      </div>
    )
  }

}
