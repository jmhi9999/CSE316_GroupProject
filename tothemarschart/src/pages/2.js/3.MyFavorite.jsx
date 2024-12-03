import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateFavorites } from '../../redux/userSlice';
import "../1.styling/3.MyFavorite.css";
import { CRYPTOS } from '../../config/cryptoConstants';

const MyFavorites = () => {
  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userFavorites = useSelector((state) => state.user.favorites ?? []);

  const fetchTickers = useCallback(async () => {
    if (!userFavorites.length) {
      setTickers([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.upbit.com/v1/ticker?markets=${userFavorites.join(',')}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTickers(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, [userFavorites]);

  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 200000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  const handleToggleFavorite = async (market) => {
    try {
      const authResponse = await axios.get("/check-auth");
      if (!authResponse.data.isAuthenticated) {
        alert("Please login to modify your favorites");
        navigate("/login");
        return;
      }

      const isFavorite = userFavorites.includes(market);
      const endpoint = isFavorite ? "/deleteFavorite" : "/addFavorite";
      
      const response = await axios.post(endpoint, { ticker: market });
      if (response.data.success) {
        dispatch(updateFavorites(response.data.favorites));
      }
    } catch (error) {
      console.error("Error modifying favorites:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Failed to modify favorites");
      }
    }
  };

  if (error) {
    return <div className="favorites-error">Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="favorites-loading">Loading...</div>;
  }

  return (
    <div>
      <img src = "/resources/4.Search/back-ground.png" alt = "back" style = {{width:'100', position:'absolute', zIndex:'-1', animation:"slideInFromBottom 0.4s ease-out forwards"}}/>
    <div className="favorites-container">
      <div className="favorites-card">
        <div className="favorites-list">
          {tickers.length === 0 ? (
            <div className="no-favorites">No favorites added yet</div>
          ) : (
            tickers.map(ticker => {
              const symbol = ticker.market.split('-')[1];
              const changeRate = (ticker.signed_change_rate * 100).toFixed(2);
              const isPositive = ticker.signed_change_rate > 0;
              const isFavorite = userFavorites.includes(ticker.market);
              const cryptoInfo = CRYPTOS[symbol] || { name: symbol };

              return (
                <div key={ticker.market} className="favorites-item">
                  <span 
                    className={`favorite-star ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => handleToggleFavorite(ticker.market)}
                  >
                    {isFavorite ? '★' : '☆'}
                  </span>
                  <div className="icon-container" onClick={() => navigate(`/search/KRW-${symbol}`)}>
                    <img
                      src={`https://static.upbit.com/logos/${symbol}.png`}
                      alt={symbol}
                      className="crypto-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-crypto-icon.png';
                      }}
                    />
                    <span className="symbol-text">{`${cryptoInfo}`}</span>
                  </div>
                  <div>
                    <span className="current-price1">
                      {Number(ticker.trade_price).toLocaleString()} KRW
                    </span>
                    <span className={`change-rate ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{changeRate}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyFavorites;