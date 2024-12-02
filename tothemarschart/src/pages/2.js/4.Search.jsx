import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useLocation } from 'react-router-dom';
import "../1.styling/4.Search.css";

const Search = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // URL에서 market 코드 추출 - 수정
  const getMarketFromPath = () => {
    const path = location.pathname;
    if (path === '/search') return 'KRW-BTC';
    const market = path.split('/search/')[1];
    return market || 'KRW-BTC'; // 기본값 설정
  };

  const market = getMarketFromPath();

  // 코인 이름 가져오기 - 수정
  const getCryptoName = (market) => {
    const symbol = market.includes('-') ? market.split('-')[1] : market;
    switch(symbol) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'XRP': return 'Ripple';
      case 'DOGE': return 'Dogecoin';
      default: return symbol;
    }
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.upbit.com/v1/candles/days?market=${market}&count=90`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        const formattedData = data
          .map(item => ({
            date: new Date(item.candle_date_time_kst).toLocaleDateString(),
            price: item.trade_price,
            change: item.change_price
          }))
          .reverse();

        setChartData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load data. Please check if the cryptocurrency code is correct.');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
  }, [market]);

  const formatKRW = (value) => {
    if (!value) return '₩0';
    return `₩${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{label}</p>
          <p className="tooltip-price">
            {formatKRW(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        Loading {getCryptoName(market)} data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        {error}
      </div>
    );
  }

  // 가격 변동률 계산
  const calculatePriceChange = () => {
    if (chartData.length < 2) return 0;
    const latestPrice = chartData[chartData.length - 1]?.price;
    const firstPrice = chartData[chartData.length - 2]?.price;
    if (!latestPrice || !firstPrice) return 0;
    return ((latestPrice - firstPrice) / firstPrice * 100).toFixed(2);
  };

  const priceChange = calculatePriceChange();
  const cryptoName = getCryptoName(market);
  const icon = `https://static.upbit.com/logos/${market.split('-')[1]}.png`;

  return (
    <div className="chart-container">
      <div className="header-container">
        <img 
          src={icon} 
          alt={`${cryptoName} icon`} 
          className="company-logo"
        />
        <div className="company-info">
          <div className="company-name">
            {cryptoName}
            <span className="star-icon">☆</span>
          </div>
          <div className="company-description">
            {cryptoName} is a cryptocurrency traded on various exchanges.
          </div>
        </div>
        <div className="price-container">
          <div>
            <div className="current-price">
              {formatKRW(chartData[chartData.length - 1]?.price)}
            </div>
            <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange}%
            </div>
          </div>
          <span className="refresh-icon">⟳</span>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={14}
            />
            <YAxis
              tickFormatter={formatKRW}
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name={`${cryptoName} Price`}
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Search;