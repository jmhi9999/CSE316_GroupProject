// App.js
import React from "react";
import Navbar from "./pages/2.js/0.Navbar.js";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./session/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/2.js/1.Main.jsx";
import Trending from "./pages/2.js/2.Trending.jsx";
import MyFavorite from "./pages/2.js/3.MyFavorite.jsx";
import Search from "./pages/2.js/4.Search.jsx";
import Login from "./pages/2.js/5.Login.jsx";
import SignUp from "./pages/2.js/6.SignUp.jsx";
import MyPage from "./pages/2.js/7.MyPage.jsx";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/myfavorite" element={<MyFavorite />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:market" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;