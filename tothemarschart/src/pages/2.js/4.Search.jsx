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
  
  // URL에서 market 코드 추출
  const getMarketFromPath = () => {
    const path = location.pathname;
    if (path === '/search') return 'KRW-BTC';
    const market = path.split('/search/')[1];
    return market || 'KRW-BTC';
  };

  const market = getMarketFromPath();

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`https://api.upbit.com/v1/candles/days?market=${market}&count=90`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        const formattedData = data
          .map(item => ({
            date: new Date(item.candle_date_time_kst).toLocaleDateString(),
            price: item.trade_price
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
        Loading {market} data...
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

  const getCryptoName = (marketCode) => {
    const name = marketCode.split('-')[1];
    return name || 'Cryptocurrency';
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        {getCryptoName(market)} Price Chart (90 Days)
      </h2>
      <div className="chart-wrapper">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name={`${getCryptoName(market)} Price`}
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Search;