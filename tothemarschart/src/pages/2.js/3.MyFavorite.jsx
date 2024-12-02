import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateFavorites } from "../../redux/userSlice";

const MyFavorite = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.user.favorites ?? []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/check-auth");
        if (response.data.isAuthenticated && response.data.user.favorites) {
          dispatch(updateFavorites(response.data.user.favorites));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [dispatch]);

  return (
    <div>
      <h1>MY Favorites</h1>
      <ul>
        {favorites.map((favorite, index) => (
          <li key={index}>{favorite}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyFavorite;