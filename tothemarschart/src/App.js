import React, {useEffect} from "react";
import Navbar from "./pages/2.js/0.Navbar.js";
import "./App.css";
import axios from "axios";

function App() {
  // test code to see if the server can communicate with the client
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get("http://localhost:3001/test");
        if (response.data.success) {
          alert(response.data.message)
        } else {
          throw new Error(response.data.message || "Failed to fetch test");
        }
      } catch (error) {
        console.error("Error fetching test:", error);
      } finally {

      }
    };

    fetchTest();
  }, []);

  return (
    <div className="App">
      <Navbar />
    </div>
  );
}

export default App;
