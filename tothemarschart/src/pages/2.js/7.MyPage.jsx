import React, { useState, useRef, useEffect } from "react";
import "../1.styling/7.MyPage.css";
import { useNavigate } from "react-router-dom";

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
  const [openModal, setOpenModal] = useState(null);
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

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

    alert("Username changed!");
    handleCloseModal();
    navigate(0);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Password cannot be empty");
      return;
    }

    alert("Password changed!");
    handleCloseModal();
    navigate(0);
  };

  const handleProfileImageUpdate = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Please select an image");
      return;
    }
    alert("Profile image changed!");
    handleCloseModal();
    navigate(0);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="container">
          <h1>User Information</h1>
          <div className="profile-image">
            <img
              src="https://res.cloudinary.com/dwp2p4j4c/image/upload/v1699578960/defaultProfile.png"
              alt="User Icon"
            />
          </div>
          <button
            onClick={() => handleOpenModal("imageModal")}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Change Image"}
          </button>
          <div className="info-row">
          </div>
          <div className="info-row">
            <button
              onClick={() => handleOpenModal("passwordModal")}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Change Password"}
            </button>
          </div>
          <div className="info-row">
            <button
              onClick={() => handleOpenModal("nameModal")}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Change Username"}
            </button>
          </div>
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
