import React, { useState, useEffect, useMemo } from "react";
import "../1.styling/2.Trending.css";
import { useNavigate } from 'react-router-dom';

const Trending = () => {
  const navigate = useNavigate(); // Navigation function from react-router-dom
  const [tickers, setTickers] = useState([]);

  const CRYPTO_NAMES = useMemo(() => ({ 'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'SOL': 'Solana', 'XRP': 'Ripple', 'DOGE': 'Dogecoin', 'ADA': 'Cardano', 'SHIB': 'Shiba Inu', 'AVAX': 'Avalanche', 'TRX': 'TRON', 'TON': 'Toncoin', 'XLM': 'Stellar', 'DOT': 'Polkadot', 'LINK': 'Chainlink', 'BCH': 'Bitcoin Cash', 'SUI': 'Sui', 'NEAR': 'NEAR Protocol', 'UNI': 'Uniswap', 'HBAR': 'Hedera', 'APT': 'Aptos', 'ETC': 'Ethereum Classic', 'MASK': 'Mask Network', 'SAND': 'The Sandbox', 'ATOM': 'Cosmos', 'IMX': 'Immutable X', 'STX': 'Stacks', 'FLOW': 'Flow', 'GRT': 'The Graph' }), []); // 빈 의존성 배열로 한 번만 생성
  const markets = useMemo(() => 'KRW-BTC,KRW-ETH,KRW-SOL,KRW-XRP,KRW-DOGE,KRW-ADA,KRW-SHIB,KRW-AVAX,KRW-TRX,KRW-TON,KRW-XLM,KRW-DOT,KRW-LINK,KRW-BCH,KRW-SUI,KRW-NEAR,KRW-UNI,KRW-HBAR,KRW-APT,KRW-ETC,KRW-MASK,KRW-SAND,KRW-ATOM,KRW-IMX,KRW-STX,KRW-FLOW,KRW-GRT', []);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch(`https://api.upbit.com/v1/ticker?markets=${markets}`);
        const data = await response.json();
        
      const formattedData = data.map((item) => {
        const symbol = item.market.split('-')[1];
        return {
          name: `${CRYPTO_NAMES[symbol] || symbol}`,
          description: `${symbol}`,
          trade_price: item.trade_price,
          value: item.signed_change_price,
          percentage: (item.signed_change_rate * 100).toFixed(2),
          icon: `https://static.upbit.com/logos/${symbol}.png`,
          acc_trade_volume: item.acc_trade_volume.toFixed(0),
          signed_change_rate: item.signed_change_rate,
          isPositive: item.signed_change_rate > 0
        };
      });
        
        setTickers(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 20000);
    return () => clearInterval(interval);
  }, [CRYPTO_NAMES, markets]); // 의존성 배열에 추가

  const volumeSort = useMemo(() => 
    [...tickers].sort((a, b) => b.acc_trade_volume - a.acc_trade_volume)
  , [tickers]);
  
  const rateSort = useMemo(() => 
    [...tickers].sort((a, b) => b.signed_change_rate - a.signed_change_rate)
  , [tickers]);

  return (
    <div className="trending-wrapper">
      <div className="trending-container">
        <div className="trending-section increasing-section">
          <h1 style={{ color: 'white', margin: '0', paddingLeft:'15px', fontSize: '55px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}> 
            Increasing <img src="/resources/2.Trending/fire.png" alt="fire" style={{ width: '100px', objectFit: 'contain', verticalAlign: 'middle' }} /> 
          </h1>
          <div className="ticker-list-container">
            <div className="ticker-list" onClick={() => {navigate('./search')}}>
              {rateSort.map((ticker, index) => (
                <div key={ticker.description} className="ticker-item">
                  <div className="ticker-left">
                    <span className="ticker-number">{index + 1}.</span>
                    <img 
                      src={ticker.icon} 
                      alt={ticker.description} 
                      className="ticker-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32';
                      }}
                    />
                    <div className="ticker-info">
                      <span className="ticker-name">{ticker.name}</span>
                      <span className="ticker-description">{ticker.description}</span>
                    </div>
                  </div>
                  <div className="ticker-right">
                    {Number(ticker.trade_price).toLocaleString()}
                    <span style={{paddingRight:"20px"}}>KRW</span>
                    <span className={`ticker-value ${ticker.isPositive ? 'positive' : 'negative'}`}>
                      {ticker.value > 0 ? '+' : ''}{Number(ticker.value).toLocaleString()} <span>KRW</span>
                    </span>
                    <span className={ticker.isPositive ? 'positive' : 'negative'}>
                      ({ticker.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="trending-section transaction-section">
          <h1 style={{paddingLeft:'15px', color: 'white', margin: '0', fontSize: '55px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}> 
            Transaction <img src="/resources/2.Trending/light.png" alt="fire" style={{ width: '100px', objectFit: 'contain', verticalAlign: 'middle', paddingBottom:'5px' }} /> 
          </h1>
          <div className="ticker-list-container">
            <div className="ticker-list" onClick={() => {navigate('./search')}}>
              {volumeSort.map((ticker, index) => (
                <div key={ticker.description} className="ticker-item">
                  <div className="ticker-left">
                    <span className="ticker-number">{index + 1}.</span>
                    <img 
                      src={ticker.icon} 
                      alt={ticker.description} 
                      className="ticker-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32';
                      }}
                    />
                    <div className="ticker-info">
                      <span className="ticker-name">{ticker.name}</span>
                      <span className="ticker-description">{ticker.description}</span>
                    </div>
                  <div style={{ flex: '1', textAlign: 'center', padding: 'auto', margin:'auto' }}>{Number(ticker.acc_trade_volume).toLocaleString()} Transaction</div>
                  </div>
                  <div className="ticker-right">
                    {Number(ticker.trade_price).toLocaleString()}
                    <span>KRW</span>
                    <span className={ticker.isPositive ? 'positive' : 'negative'}>
                      ({ticker.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;