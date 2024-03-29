import styled from 'styled-components';
import React, { useEffect, useState } from 'react'
import CoinList from './components/CoinList/CoinList';
import AccountBalanceHeader from './components/AccountBalanceHeader/AccountBalanceHeader';
import CoinDetails from './components/CoinDetails/CoinDetails';
import axios from 'axios';

const AppCss = styled.div`
  text-align: center; 
  color: rgb(255, 255, 255); 
  width: 100%; 
`
const COIN_COUNT = 20;
const formatPrice = price => parseFloat(Number(price).toFixed(4));

function App(props) {
  const [cashBalance, setCashBalance] = useState(10000);
  const [cryptoBalance, setCryptoBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const [coinDetailReveal, setCoinDetailReveal] = useState(false);
  const [coinDescription, setCoinDescription] = useState();
  const [coinTwitter, setCoinTwitter] = useState();
  const [coinInfo, setCoinInfo] = useState([]);
  const [coinDataDetail, setCoinDataDetail] = useState();

  // const [coinBuySellAmount, setCoinBuySellAmount] = useState(0);

  const componentDidMount = async () => {

    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets',{
      params: {
        vs_currency: 'usd',
        ids: ''
      }
    });
    const coinData = response.data.slice(0, COIN_COUNT).map(function (coin) {
      return {
        key: coin.id,
        name: coin.name,
        image: coin.image,
        ticker: coin.symbol,
        id: coin.id,
        coinBalance: 0,
        price: formatPrice(coin.current_price),
        priceChange24h: parseFloat(Number(coin.price_change_percentage_24h).toFixed(2)),
      };
    });
    setCoinData(coinData);
    // console.log(coinData);

    // getCoinInfo();
    // const tickerURL = 'https://api.coinpaprika.com/v1/tickers/';
    // const promises = coinIDs.map(id => axios.get(tickerURL + id));
    // const coinData = await Promise.all(promises);
    // const coinPriceData = coinData.map( function(response) {
    //   const coin = response.data;
    //   return {
    //     key: coin.id,
    //     name: coin.name,
    //     ticker: coin.symbol,
    //     id: coin.id,
    //     coinBalance: 0,
    //     price: coin.quotes.USD.price,
    //   }
    // });
  }

  // const calculateEachCoinBalance = () => {
  //   const newCoinData = coinData.map(function(coin){
  //     let newValues = {...coin};
  //     const coinCashBalane = coin.price * coin.coinBalance;
  //     newValues.coinCashBalane = coinCashBalane;
  //     return newValues;
  //   })
  //   setCoinData(newCoinData);
  // }

  const handleHide = () => {
    setShowBalance(!showBalance);
    console.log(showBalance);
  }

  const handleCoinPriceRquest = async (coinId) => {
    const tickerURL = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const response = await axios.get(tickerURL);
    // console.log( "Response data is " ,response.data );  --> Checking if the response is correct
    const newPrice = response.data.market_data.current_price.usd; 
    console.log("New price for ", coinId, " is ", newPrice); // --> Checking if the new price is correct
    return newPrice;
  }
    
  // const handleRefresh = async (valueChangeId) => {
  //   const newPrice = await handleCoinPriceRquest(valueChangeId);
  //   const newCoinData = coinData.map( function(coin) {
  //     let newValues = {...coin}
  //     if (valueChangeId === coin.id) {
  //       console.log("Price of the", coin.name, "is", newPrice.typeof);
  //       newValues.price = newPrice;
  //     }
  //     return newValues;
  //   });
  //   setCoinData(newCoinData);
  // }

  const handleBuy = async (coinId, amount) => {
    console.log("Coin id is ", coinId);
    let success;
    if (amount <= cashBalance) {
      const newPrice = await handleCoinPriceRquest(coinId);
      const newCoinData = coinData.map( function(coin) {
        let newValues = {...coin}
        if (coinId === coin.id) {
          newValues.price = newPrice;
          newValues.coinBalance = newValues.coinBalance + amount/newPrice;
          const newCashBalance = cashBalance - amount;
          setCashBalance(newCashBalance);
          console.log("Coin balance is", newValues.coinBalance);
        }
        return newValues;
      }); 
      setCoinData(newCoinData);
      // calculateBalance();
      success = true;
    } else {
      console.log("You don't have enough cash");
      alert("You don't have enough cash");
      success = false;
    }
    return success;
  }

  const handleSell = async (coinId, amount) => {
    let success;
    const newPrice = await handleCoinPriceRquest(coinId);
    const newCoinData = coinData.map( function(coin) {
      let newValues = {...coin}
      if (coinId === coin.id) {
        if (amount/newPrice < coin.coinBalance) {
          newValues.price = newPrice;
          newValues.coinBalance = newValues.coinBalance - amount/newPrice;
          const newCashBalance = cashBalance + amount;
          setCashBalance(newCashBalance);
          console.log("Coin balance is", newValues.coinBalance);
          success = true;
        } else {
          console.log("Not enough", coin.name, "to sell");
          alert("Not enough " + coin.name +  " to sell");
          success = false;
        }
      }
      return newValues;
    }); 
    setCoinData(newCoinData);
    // calculateBalance();
    return success;
  }

  

  const handleInfo = async (valueChangeId) => {
    // debugger;
    coinInfo.map((coin) => {
      if (valueChangeId === coin.id) {
        console.count("Coin twitter website is " + coin.twitterName);
        setCoinTwitter(coin.twitterName );
        setCoinDescription(coin.description);
      }
      return coin;
    });
    coinData.map((coin) => {
      if (valueChangeId === coin.id) {
        setCoinDataDetail(coin);
        console.log("Coin detail for CoinData componnets is ", coin);
      }
      return coin;
    });
    setCoinDetailReveal(!coinDetailReveal);
  }

  const handleBack = () => {
    setCoinDetailReveal(!coinDetailReveal);
  }

  const handleAirdrop = () => {
    setCashBalance(cashBalance + 1200);
  }

  useEffect(() => {
    if ( coinData.length === 0 ) {
      componentDidMount();
    }
  });

  useEffect(() => {
    const getCoinInfo = async () => {
      // debugger;
      const tickerURL = 'https://api.coingecko.com/api/v3/coins/';
      const promises = coinData.map(function(el){ 
        // debugger;
        // console.log("Coin id is ", el.id);
        return axios.get(tickerURL + el.id);
      });
      const promisedCoinData = await Promise.all(promises);
      const newCoinInfo = promisedCoinData.map( function(response) {
        // console.log("Twitter screen name is ", response.data.links.twitter_screen_name);
        const coin = response.data;
        return {
          key: coin.id,
          id: coin.id,
          description: coin.description.en,
          twitterName: coin.links.twitter_screen_name,
        }
      });
      console.log("newCoinInfo --> ",newCoinInfo);
      console.count("GetInfo api called executed");
      setCoinInfo(newCoinInfo);
    }
    if ( coinData.length > 0 ) {
      getCoinInfo();
    }
  } , [coinData]);

  useEffect(() => {
    const calculateBalance = () => {
      let totalBalance = 0;
      coinData.forEach(function( {price, coinBalance}){
        totalBalance += price * coinBalance;
        return totalBalance;
      })
      setCryptoBalance(totalBalance);
      console.log("Total Coin balance is -->",totalBalance);
    } 
    if ( coinData.length > 0 ) {
      calculateBalance();
    }
  } , [coinData]);

  return (
    <AppCss className='bg-gradient-to-b from-cyan-400 to-blue-400'>
      <AccountBalanceHeader 
        cryptoBalance={cryptoBalance}
        amount={cashBalance}
        showBalance={showBalance}
        handleHide={handleHide}
        handleAirdrop={handleAirdrop}
      />
      { !coinDetailReveal ? 
        <CoinList 
          coinData={coinData} 
          handleHide={handleHide}
          showBalance={showBalance}
          handleInfo={handleInfo}
          handleBuy={handleBuy}
          handleSell={handleSell} /> 
        : 
        <CoinDetails 
          handleInfo={handleInfo}
          handleBack={handleBack}
          coinDescription={coinDescription}
          coinTwitter={coinTwitter}
          coinDataDetail={coinDataDetail}
        /> 
      }
    </AppCss>
  );
  
}

export default App;
