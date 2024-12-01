import React from "react";
import Navbar from "./pages/2.js/0.Navbar.js";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./session/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="App">
          <Navbar />
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
