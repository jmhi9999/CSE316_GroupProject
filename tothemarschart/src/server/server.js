const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Cors -> only allow requests from 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// session setting - going to use for login 
app.use(session({
  secret: 'tempKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "114181150",
  database: "CSE316_Team",
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// test route to test connection between server and the client
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "test fetch successful!"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});