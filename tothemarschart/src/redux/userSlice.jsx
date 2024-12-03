import { createSlice } from '@reduxjs/toolkit';
// redux hook to store state information in one source.
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    username: null,
    passwordLength: 0,
    profileImage: "https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png",
    isLoggedIn: false,
    favorites: []
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
      state.passwordLength = action.payload.passwordLength;
      state.isLoggedIn = true;
      state.favorites = action.payload.favorites;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    updateFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    logout: (state) => {
      state.email = null;
      state.username = null;
      state.profileImage =  "https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png";
      state.passwordLength = 0;
      state.isLoggedIn = false;
      state.favorites = [];
    }
  }
});

export const { setUser, updateUsername, updateProfileImage, updateFavorites, passwordLength, logout } = userSlice.actions;
export default userSlice.reducer;