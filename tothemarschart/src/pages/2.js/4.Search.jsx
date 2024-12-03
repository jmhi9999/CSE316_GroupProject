import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateFavorites } from "../../redux/userSlice";
import axios from "axios";
import "../1.styling/4.Search.css";

const Search = () => {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user's favorites from Redux store
  const userFavorites = useSelector((state) => state.user.favorites ?? []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/check-auth");
        if (response.data.isAuthenticated) {
          const user = response.data.user;
          if (user && user.favorites) {
            dispatch(updateFavorites(user.favorites));
          }
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [dispatch]);

  const getMarketFromPath = () => {
    const path = location.pathname;
    if (path === '/search') return 'KRW-BTC';
    const market = path.split('/search/')[1];
    return market || 'KRW-BTC';
  };

  const market = getMarketFromPath();
  // Check if current market is in favorites
  const [isFavorite, setIsFavorite] = useState(userFavorites.includes(market));

  useEffect(() => {
    // Update isFavorite whenever market or userFavorites changes
    setIsFavorite(userFavorites.includes(market));
  }, [market, userFavorites]);

  const handleAddFavorite = async () => {
    try {
      // First check authentication status
      const authResponse = await axios.get("/check-auth");
      if (!authResponse.data.isAuthenticated) {
        alert("Please Login to add this crypto to your favorites");
        navigate("/login");
        return;
      }
  
      const response = await axios.post("/addFavorite", { ticker: market });
  
      if (response.data.success) {
        dispatch(updateFavorites(response.data.favorites));
        alert("Added to favorites successfully!");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Error adding to favorites");
      }
    }
  };
  
  const handleDeleteFavorite = async () => {
    try {
      // First check authentication status
      const authResponse = await axios.get("/check-auth");
      if (!authResponse.data.isAuthenticated) {
        alert("Please Login to add this crypto to your favorites");
        navigate("/login");
        return;
      }
  
      const response = await axios.post("/deleteFavorite", { ticker: market });
  
      if (response.data.success) {
        dispatch(updateFavorites(response.data.favorites));
        alert("Deleted from favorites!");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Error removing from favorites");
      }
    }
  };


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

  const fetchCryptoData = useCallback(async () => {
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
  }, [market]);
  
  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

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
    <div>
      <img src = "/resources/4.Search/back-ground.png" alt = "back" style = {{width:'100', position:'absolute', zIndex:'-1'}}/>
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
              <span 
                className={`star-icon ${isFavorite ? 'favorited' : ''}`}
                onClick={isFavorite ? handleDeleteFavorite : handleAddFavorite}
              >
                {isFavorite ? '★' : '☆'}
              </span>
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
            <span className="refresh-icon" onClick={() => fetchCryptoData()}>⟳</span>
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
      </div>
  );
};

export default Search;