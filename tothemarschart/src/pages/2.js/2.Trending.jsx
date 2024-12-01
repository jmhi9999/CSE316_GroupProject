import React, { useState, useEffect } from "react";
import "../1.styling/2.Trending.css";
import { Flame, Zap } from 'lucide-react';

const Trending = () => {
  const [tickers, setTickers] = useState([]);

  const CRYPTO_NAMES = { 'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'SOL': 'Solana', 'XRP': 'Ripple', 'DOGE': 'Dogecoin', 'ADA': 'Cardano', 'SHIB': 'Shiba Inu', 'AVAX': 'Avalanche', 'TRX': 'TRON', 'TON': 'Toncoin', 'XLM': 'Stellar', 'DOT': 'Polkadot', 'LINK': 'Chainlink', 'BCH': 'Bitcoin Cash', 'SUI': 'Sui', 'NEAR': 'NEAR Protocol', 'UNI': 'Uniswap', 'HBAR': 'Hedera', 'APT': 'Aptos', 'ETC': 'Ethereum Classic', 'MASK': 'Mask Network', 'SAND': 'The Sandbox', 'ATOM': 'Cosmos', 'IMX': 'Immutable X', 'STX': 'Stacks', 'FLOW': 'Flow', 'GRT': 'The Graph' };
  const markets = 'KRW-BTC,KRW-ETH,KRW-SOL,KRW-XRP,KRW-DOGE,KRW-ADA,KRW-SHIB,KRW-AVAX,KRW-TRX,KRW-TON,KRW-XLM,KRW-DOT,KRW-LINK,KRW-BCH,KRW-SUI,KRW-NEAR,KRW-UNI,KRW-HBAR,KRW-APT,KRW-ETC,KRW-MASK,KRW-SAND,KRW-ATOM,KRW-IMX,KRW-STX,KRW-FLOW,KRW-GRT';

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
            value: `${item.signed_change_price > 0 ? '+' : ''}${item.signed_change_price.toFixed(2)}`,
            percentage: `(${(item.signed_change_rate * 100).toFixed(2)}%)`,
            icon: `https://static.upbit.com/logos/${symbol}.png`,
            trade_price: item.trade_price,
            acc_trade_volume: item.acc_trade_volume,
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
    const interval = setInterval(fetchTickers, 5000);
    return () => clearInterval(interval);
  }, []);

  const volumeSort = [...tickers].sort((a, b) => b.acc_trade_volume - a.acc_trade_volume);
  const rateSort = [...tickers].sort((a, b) => b.signed_change_rate - a.signed_change_rate);

  return (
    <div className="trending-container">
      <div className="trending-section increasing-section">
        <div className="ticker-list">
          {rateSort.slice(0, 6).map((ticker, index) => (
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
                <span className={`ticker-value ${ticker.isPositive ? 'positive' : 'negative'}`}>
                  {ticker.value}
                </span>
                <span className={ticker.isPositive ? 'positive' : 'negative'}>
                  {ticker.percentage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trending-section transaction-section">
        <div className="ticker-list">
          {volumeSort.slice(0, 6).map((ticker, index) => (
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
                <span className={`ticker-value ${ticker.isPositive ? 'positive' : 'negative'}`}>
                  {ticker.value}
                </span>
                <span className={ticker.isPositive ? 'positive' : 'negative'}>
                  {ticker.percentage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;