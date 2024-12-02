import React, { useState, useRef, useEffect } from "react";
import "../1.styling/7.MyPage.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUsername,
  updateProfileImage,
  setUser as setReduxUser,
  logout  as reduxLogout,
} from "../../redux/userSlice";
import { CLOUDINARY_CONFIG } from "../../config/cloudinary.js";
import { useAuth } from "../../session/AuthContext";
import { useNavigate } from "react-router-dom";
import { hashutil } from "./8.Hashutil";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

function MyPage() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;
  const [openModal, setOpenModal] = useState(null);
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser, checkAuth, logout: sessionLogout } = useAuth();
  

  const reduxEmail = useSelector((state) => state.user.email);
  const reduxProfileImage = useSelector((state) => state.user.profileImage);

  const userEmail = authUser?.email || reduxEmail;

  useEffect(() => {
    if (authUser?.profileImage) {
      setCurrentProfileImage(authUser.profileImage);
      dispatch(updateProfileImage(authUser.profileImage));
    }
  }, [authUser, dispatch]);

  const [currentProfileImage, setCurrentProfileImage] = useState(
    authUser?.profileImage ||
      reduxProfileImage ||
      "https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png"
  );

  const handleOpenModal = (modalId) => {
    setOpenModal(modalId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setUsername("");
    setPassword("");
    setOldPassword("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    if (!userEmail) {
      alert("User email is not available. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Updating username:", { username, userEmail });
      const response = await axios.post(
        "/updateUsername",
        {
          username: username,
          EmailAddress: userEmail,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(updateUsername(username));

        if (authUser?.updateAuthUser) {
          await authUser.updateAuthUser({ username: username });
        }

        const authResponse = await axios.get("/check-auth", {
          withCredentials: true,
        });
        if (authResponse.data.isAuthenticated) {
          dispatch(setReduxUser(authResponse.data.user));
        }

        alert("Username updated successfully!");
        handleCloseModal();
        setUsername("");
      } else {
        throw new Error(response.data.message || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      alert(error.response?.data?.message || "Error updating username");
    } finally {
      setIsLoading(false);
      navigate(0);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!userEmail) {
      alert("User email is not available");
      return;
    }

    setIsLoading(true);
    try {
      const hashedOldPassword = hashutil(userEmail, oldPassword);
      const hashedNewPassword = hashutil(userEmail, password);

      const response = await axios.post(
        "/updatePassword",
        {
          EmailAddress: userEmail,
          oldPassword: hashedOldPassword, 
          newPassword: hashedNewPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await checkAuth();
        setPassword("");
        setOldPassword("");
        alert("Password updated successfully!");
        handleCloseModal();
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.message || "Error updating password");
    } finally {
      setIsLoading(false);
      navigate(0);
    }
  };

  const handleProfileImageUpdate = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_CONFIG.upload_preset);
      formData.append("api_key", CLOUDINARY_CONFIG.api_key);
      formData.append("timestamp", (Date.now() / 1000) | 0);

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dwp2p4j4c/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );

      if (!cloudinaryResponse.data.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const imageUrl = cloudinaryResponse.data.secure_url;

      const response = await axios.post(
        "/updateProfileImage",
        {
          EmailAddress: userEmail,
          profileImage: imageUrl,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(updateProfileImage(imageUrl));
        if (authUser?.updateAuthUser) {
          await authUser.updateAuthUser({ profileImage: imageUrl });
        }
        await checkAuth();
        setCurrentProfileImage(imageUrl);
        alert("Profile image updated successfully!");
        handleCloseModal();
      } else {
        throw new Error(
          response.data.message || "Failed to update profile image"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Error updating profile image. Please try again."
      );
    } finally {
      setIsLoading(false);
      navigate(0);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await sessionLogout();
      if(result.success) {
        dispatch(reduxLogout());
          navigate("/");
          alert("Sucessfully Logged Out!");
      } else {
        console.error("Logout failed:", result.message);
          alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error during logout. Please try again.");
    }
  } 


  if (!authUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="profile-section">
          <div className="profile-image-container">
            <img
              src={currentProfileImage}
              alt="User Icon"
              onError={(e) => {
                e.target.src =
                  "https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png";
              }}
              className="profile-img"
              onClick={() => handleOpenModal("imageModal")}
            />
            <button className="edit-button" disabled={isLoading}>
              Edit
            </button>
          </div>
        </div>

        <div className="buttons-section">
          <button
            className="gradient-button username-button"
            onClick={() => handleOpenModal("nameModal")}
            disabled={isLoading}
          >
            Change username
          </button>

          <button
            className="gradient-button password-button"
            onClick={() => handleOpenModal("passwordModal")}
            disabled={isLoading}
          >
            Change password
          </button>

          <button className="logout-button">
            <img
              src="resources/7.MyPage/LogOut.png"
              alt="Log Out"
              className="logout-image"
              onClick={handleSignOut}
            />
          </button>

          <button className="help-button">
            <img
              src="resources/7.MyPage/clickHereIfYouHaveAnyQuestions.png"
              alt="Click here if you have any questions"
              className="help-image"
            />
          </button>
        </div>
      </div>

      <Modal
        isOpen={openModal === "imageModal"}
        onClose={handleCloseModal}
        title="Change your image"
      >
        <form onSubmit={handleProfileImageUpdate} className="modal-form">
          <div className="form-group">
            <label htmlFor="imageUpload">Choose file:</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="imageUpload"
                ref={fileInputRef}
                accept="image/*"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="modal-buttons">
            <button
              type="button"
              className="close-button"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Close
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={openModal === "passwordModal"}
        onClose={handleCloseModal}
        title="Change your password"
      >
        <form onSubmit={handlePasswordUpdate} className="modal-form">
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="modal-buttons">
            <button
              type="button"
              className="close-button"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Close
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={openModal === "nameModal"}
        onClose={handleCloseModal}
        title="Change your name"
      >
        <form onSubmit={handleUsernameUpdate} className="modal-form">
          <div className="form-group">
            <label htmlFor="nameChange">New Username:</label>
            <input
              type="text"
              id="nameChange"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="modal-buttons">
            <button
              type="button"
              className="close-button"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Close
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MyPage;
