"use client"

import { useState } from "react"
import {User, Shield, Edit2, Trash2, Save, X, Eye, EyeOff, Camera } from "lucide-react"
import "./Settings.css"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown";
import Sidebar from "../../../../component/SideBar/PatientSideBar/SideBar"

const Settings = () => {
  
  // State for user information
  const [userInfo, setUserInfo] = useState({
    firstName: "dwak",
    lastName: "test",
    email: "TestDwak@gmail.com",
    phone: "+213 555 393238",
    address: "Univ . Ain temouchent",
    avatar: "../Images/logo.png",
  })

  // State for security information
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // UI States
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [tempUserInfo, setTempUserInfo] = useState(userInfo)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const [errors, setErrors] = useState({})

  // Updated validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const validatePhone = (phone) => {
    const re = /^\+213[0-9]{9}$/
    return re.test(phone.replace(/\s+/g, ""))
  }

  const validateName = (name) => {
    return name.length >= 2 && name.length <= 50 && !/\d/.test(name)
  }

  // Handle profile information update with improved validation
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!validateName(tempUserInfo.firstName)) {
      newErrors.firstName = "First name should be between 2 and 50 characters and not contain numbers"
    }
    if (!validateName(tempUserInfo.lastName)) {
      newErrors.lastName = "Last name should be between 2 and 50 characters and not contain numbers"
    }
    if (!validateEmail(tempUserInfo.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!validatePhone(tempUserInfo.phone)) {
      newErrors.phone = "Invalid phone number. Use format: +213XXXXXXXXX"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Here you would make an API call to update the user's profile
      // await updateUserProfile(tempUserInfo)
      setUserInfo(tempUserInfo)
      setIsEditing(false)
      setErrors({})
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrors({ submit: "Failed to update profile. Please try again." })
    }
  }

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    // Error handling
    const newErrors = {}

    if (!securityInfo.currentPassword) {
      newErrors.currentPassword = "Current password is required."
    }

    if (securityInfo.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long."
    }

    if (!/\d/.test(securityInfo.newPassword) || !/[A-Z]/.test(securityInfo.newPassword)) {
      newErrors.newPassword = "New password must contain at least one number and one uppercase letter."
    }

    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      newErrors.confirmPassword = "New password and confirmation do not match."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Here you would call your backend to update the password
      // Example: await updateUserPassword(securityInfo);

      alert("Password updated successfully!")

      // Reset password fields
      setSecurityInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setErrors({})
    } catch (error) {
      console.error("Error updating password:", error)
      setErrors({ submit: "Failed to update password. Please try again." })
    }
  }

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        // Here you would typically upload the file to your server
        // and get back a URL to store in the user's profile
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle avatar deletion
  const handleAvatarDelete = async () => {
    try {
      // Here you would make an API call to delete the avatar
      // await deleteUserAvatar()
      setUserInfo((prev) => ({ ...prev, avatar: "/placeholder.svg?height=200&width=200" }))
      setAvatarPreview(null)
    } catch (error) {
      console.error("Error deleting avatar:", error)
    }
  }

  return (
    <div className="settings-page">
      <Sidebar/>
      <ProfileDropdown />
      <div className="settings-container">
        <h1 className="settings-title">Account Settings</h1>

        {/* Settings Navigation */}
        <div className="settings-nav">
          <button
            className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="w-4 h-4" />
            Profile Information
          </button>
          <button
            className={`nav-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="w-4 h-4" />
            Security
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === "profile" && (
          <div className="settings-content">
            <div className="avatar-section">
              <div className="avatar-container">
                <img src={avatarPreview || userInfo.avatar} alt="Profile" className="avatar-image" />
                <div className="avatar-overlay">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label htmlFor="avatar-upload" className="avatar-upload-button">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </label>
                  {avatarPreview && (
                    <button onClick={handleAvatarDelete} className="avatar-delete-button">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-header">
                <h2>Personal Information</h2>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="edit-button">
                  {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={tempUserInfo.firstName}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, firstName: e.target.value })}
                    disabled={!isEditing}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={tempUserInfo.lastName}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, lastName: e.target.value })}
                    disabled={!isEditing}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={tempUserInfo.email}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, email: e.target.value })}
                    disabled={!isEditing}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={tempUserInfo.phone}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, phone: e.target.value })}
                    disabled={!isEditing}
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={tempUserInfo.address}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
              {errors.submit && <span className="error-message">{errors.submit}</span>}
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="settings-content">
            <form onSubmit={handlePasswordUpdate} className="settings-form">
              <div className="form-header">
                <h2>Change Password</h2>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    value={securityInfo.currentPassword}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        currentPassword: e.target.value,
                      })
                    }
                    className={errors.currentPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="password-toggle"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    value={securityInfo.newPassword}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        newPassword: e.target.value,
                      })
                    }
                    className={errors.newPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="password-toggle"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    value={securityInfo.confirmPassword}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="password-toggle"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
              {errors.submit && <span className="error-message">{errors.submit}</span>}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings

