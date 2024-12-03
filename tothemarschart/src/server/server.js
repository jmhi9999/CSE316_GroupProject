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
  password: "1q2w3e4r",
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
    console.log('Session check:', {
      sessionExists: !!req.session,
      sessionUser: req.session?.user,
      sessionID: req.sessionID
    });
    
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
          favorites: result[0].Favorites
        };

        res.json({
          success: true,
          user: {
            id: result[0].Id,
            email: result[0].UserEmail,
            passwordLength: result[0].Password,
            username: result[0].Username,
            profileImage: result[0].ProfileImage,
            favorites: result[0].Favorites
          },
        });

        console.log('Session after login:', {
            sessionID: req.sessionID,
            sessionUser: req.session.user
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
    "INSERT INTO User (UserEmail, Username, Password, ProfileImage, Favorites) VALUES (?, ?, ?, 'https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png', '[]')",
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

// route to add to favorite
app.post("/addFavorite", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated"
    });
  }

  const ticker = String(req.body.ticker);
  const userEmail = req.session.user.email;

  if (!ticker) {
    return res.status(400).json({
      success: false,
      error: "Ticker is required"
    });
  }
  // if there exists same crypto in the user's favorites, do nothing
  // add to favorite list and post to database otherwise
  connection.query(
    "SELECT Favorites FROM User WHERE UserEmail = ?",
    [userEmail],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          success: false,
          error: "Database error"
        });
      }

      let currentFavorites = [];      
      if (result[0].Favorites) {
        const normalizeToArray = (data) => {
          if (Array.isArray(data)) {
            return data.reduce((acc, item) => {
              if (Array.isArray(item)) {
                return [...acc, ...normalizeToArray(item)];
              }
              return [...acc, item];
            }, []);
          }
          return [data];
        };

        try {
          let parsedData;
          try {
            parsedData = JSON.parse(result[0].Favorites);
          } catch {
            parsedData = result[0].Favorites;
          }
          
          currentFavorites = normalizeToArray(parsedData);
          
          currentFavorites = currentFavorites.filter(item => item && item !== "");
          
          currentFavorites = [...new Set(currentFavorites)];
        } catch (error) {
          console.error("Error processing favorites:", error);
          currentFavorites = [];
        }
      }

      if (!currentFavorites.includes(ticker)) {
        currentFavorites.push(ticker);
      }

      const favoritesJson = JSON.stringify(currentFavorites);

      // update new favorites to database
      // update session favorites if suceeded
      connection.query(
        "UPDATE User SET Favorites = ? WHERE UserEmail = ?",
        [favoritesJson, userEmail],
        (updateErr) => {
          if (updateErr) {
            console.error("Update Error:", updateErr);
            return res.status(500).json({
              success: false,
              error: "Error updating favorites"
            });
          }

          req.session.user = {
            ...req.session.user,
            favorites: currentFavorites
          };

          res.json({
            success: true,
            message: "Added to favorites successfully",
            favorites: currentFavorites
          });
        }
      );
    }
  );
});

// route to delete from favorites
// check database if certain crypto exists in the user's favorites
// delete the crypto and update the database and session's favorites
app.post("/deleteFavorite", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated"
    });
  }

  const ticker = String(req.body.ticker);
  const userEmail = req.session.user.email;

  if (!ticker) {
    return res.status(400).json({
      success: false,
      error: "Ticker is required"
    });
  }

  connection.query(
    "SELECT Favorites FROM User WHERE UserEmail = ?",
    [userEmail],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          success: false,
          error: "Database error"
        });
      }

      let currentFavorites = [];
      
      if (result[0].Favorites) {
        const normalizeToArray = (data) => {
          if (Array.isArray(data)) {
            return data.reduce((acc, item) => {
              if (Array.isArray(item)) {
                return [...acc, ...normalizeToArray(item)];
              }
              return [...acc, item];
            }, []);
          }
          return [data];
        };

        try {
          let parsedData;
          try {
            parsedData = JSON.parse(result[0].Favorites);
          } catch {
            parsedData = result[0].Favorites;
          }
          
          currentFavorites = normalizeToArray(parsedData);
          
          currentFavorites = currentFavorites.filter(item => item && item !== "");
          
          currentFavorites = [...new Set(currentFavorites)];
        } catch (error) {
          console.error("Error processing favorites:", error);
          currentFavorites = [];
        }
      }

      const updatedFavorites = currentFavorites.filter(fav => fav !== ticker);

      const favoritesJson = JSON.stringify(updatedFavorites);

      connection.query(
        "UPDATE User SET Favorites = ? WHERE UserEmail = ?",
        [favoritesJson, userEmail],
        (updateErr) => {
          if (updateErr) {
            console.error("Update Error:", updateErr);
            return res.status(500).json({
              success: false,
              error: "Error updating favorites"
            });
          }

          req.session.user = {
            ...req.session.user,
            favorites: updatedFavorites
          };

          res.json({
            success: true,
            message: "Removed from favorites successfully",
            favorites: updatedFavorites
          });
        }
      );
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
