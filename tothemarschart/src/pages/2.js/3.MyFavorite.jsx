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
  
  // get const with userselector
  const userFavorites = useSelector((state) => state.user.favorites);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Check the my favorite list with server
  useEffect(() => {
    const checkAuthAndFavorites = async () => {
      try {
        const response = await axios.get('/check-auth');
        if (response.data.sessionExists && response.data.sessionUser.favorites) {
          dispatch(updateFavorites(response.data.sessionUser.favorites));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setError('Failed to load favorites');
      }
    };

    if (!userFavorites || userFavorites.length === 0) {
      checkAuthAndFavorites();
    }
  }, [dispatch]);

  const fetchTickers = useCallback(async () => {
    if (!userFavorites || userFavorites.length === 0) {
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
    if (userFavorites && userFavorites.length > 0) {
      fetchTickers();
      const interval = setInterval(fetchTickers, 200000);
      return () => clearInterval(interval);
    }
  }, [fetchTickers, userFavorites]);

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
    fetchTickers();
  }, [dispatch]);

  const handleToggleFavorite = async (market) => {
    if (!isLoggedIn) {
      alert("Please login to modify your favorites");
      navigate("/login");
      return;
    }

    try {
      // First check authentication status
      const authResponse = await axios.get("/check-auth");
      if (!authResponse.data.isAuthenticated) {
        alert("Please Login to add this crypto to your favorites");
        navigate("/login");
        return;
      }

      const endpoint = userFavorites.includes(market) ? "/deleteFavorite" : "/addFavorite";
      const response = await axios.post(endpoint, { ticker: market });
      
      if (response.data.success) {
        dispatch(updateFavorites(response.data.favorites));
        alert("Deleted from favorites!")
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
      <img src="/resources/4.Search/back-ground.png" alt="back" style={{width:'100', position:'absolute', zIndex:'-1', animation:"slideInFromBottom 0.4s ease-out forwards"}}/>
      <div className="favorites-container">
        <div className="favorites-card">
          <div className="favorites-list">
            {(!userFavorites || userFavorites.length === 0) ? (
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