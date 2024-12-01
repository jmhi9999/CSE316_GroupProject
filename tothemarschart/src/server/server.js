const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Cors -> only allow requests from 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// session setting - going to use for login
app.use(
  session({
    secret: "tempKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    },
  })
);

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
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});



// check authorization before loggin in
app.get("/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM User WHERE UserEmail = ? AND Password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.error("Database Error: ", err);
        return res.status(500).json({
          success: false,
          error: "Database error",
        });
      }

      if (result.length > 0) {
        req.session.user = {
          id: result[0].Id,
          email: result[0].UserEmail,
          username: result[0].Username,
          profileImage: result[0].ProfileImage,
        };

        res.json({
          success: true,
          user: {
            id: result[0].Id,
            email: result[0].UserEmail,
            passwordLength: result[0].Password,
            username: result[0].Username,
            profileImage: result[0].ProfileImage,
          },
        });
      } else {
        res.json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
    }
  );
});

// logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// User sign up route
app.post("/signUp", (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields (email, username, password) are required",
    });
  }

  connection.query(
    "INSERT INTO User (UserEmail, Username, Password, ProfileImage) VALUES (?, ?, ?, 'https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png')",
    [email, username, password],
    (err, result) => {
      if (err) {
        if (err.errno === 1062) {
          return res.status(201).json({
            success: false,
            error: "Email or username already exists",
          });
        }
        console.error("Signup Error:", err);
        return res.status(500).json({
          success: false,
          error: "Error during signup process",
        });
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    }
  );
});

// update username route
app.post("/updateUsername", (req, res) => {
  const { EmailAddress, username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: "Username is required",
    });
  }

  connection.query(
    "UPDATE User SET Username = ? WHERE UserEmail = ?",
    [username, EmailAddress],
    (err, result) => {
      if (err) {
        console.error("Error updating username:", err);
        return res.status(500).json({
          success: false,
          error: "Database error",
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (req.session.user) {
        req.session.user.username = username;
      }

      res.json({
        success: true,
        message: "Username updated successfully",
        updatedUsername: username,
        user: req.session.user,
      });
    }
  );
});

// update password route
app.post("/updatePassword", (req, res) => {
  const { EmailAddress, oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Both old and new passwords are required",
    });
  }

  connection.query(
    "SELECT * FROM User WHERE UserEmail = ? AND Password = ?",
    [EmailAddress, oldPassword],
    (err, result) => {
      if (err) {
        console.error("Error checking current password:", err);
        return res.status(500).json({
          success: false,
          error: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      connection.query(
        "UPDATE User SET Password = ? WHERE UserEmail = ?",
        [newPassword, EmailAddress],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating password:", updateErr);
            return res.status(500).json({
              success: false,
              error: "Database error",
            });
          }

          if (updateResult.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              error: "User not found",
            });
          }

          res.json({
            success: true,
            message: "Password updated successfully",
          });
        }
      );
    }
  );
});

//update profile image route
app.post("/updateProfileImage", (req, res) => {
  const { EmailAddress, profileImage } = req.body;

  if (!profileImage) {
    console.log("No profile image provided");
    return res.status(400).json({
      success: false,
      error: "Profile image is required",
    });
  }

  if (!EmailAddress) {
    console.log("No email address provided");
    return res.status(400).json({
      success: false,
      error: "Email address is required",
    });
  }

  connection.query(
    "UPDATE User SET ProfileImage = ? WHERE UserEmail = ?",
    [profileImage, EmailAddress],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Database error",
          details: err.message,
        });
      }

      if (result.affectedRows === 0) {
        console.log("No user found with email:", EmailAddress);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (req.session.user) {
        req.session.user.profileImage = profileImage;
      }

      res.json({
        success: true,
        message: "Profile image updated successfully",
        updatedProfileImage: profileImage,
      });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
