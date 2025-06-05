"use client"

import { useState, useRef } from "react"
import { FaUser, FaIdCard, FaCalendarAlt, FaStethoscope, FaBell, FaShieldAlt, FaTimes, FaCheck } from "react-icons/fa"
import "./DoctorSettings.css"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"
import Sidebar from "../../../../component/SideBar/DoctorSideBar/DoctorSideBar"


const DoctorSettings = () => {
  const [activeSection, setActiveSection] = useState("profile-section")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [avatar, setAvatar] = useState("")
  const fileInputRef = useRef(null)

  // Specialties state
  const [specialties, setSpecialties] = useState(["psychologie comportementale et cognitive", "thérapie cognitivo-comportementale"])
  const [newSpecialty, setNewSpecialty] = useState("")

  // Availability state
  const [availability, setAvailability] = useState({
    monday: { available: true, start: "09:00", end: "17:00" },
    tuesday: { available: true, start: "09:00", end: "17:00" },
    wednesday: { available: true, start: "09:00", end: "17:00" },
    thursday: { available: true, start: "09:00", end: "17:00" },
    friday: { available: true, start: "09:00", end: "15:00" },
    saturday: { available: false, start: "10:00", end: "14:00" },
    sunday: { available: false, start: "10:00", end: "14:00" },
  })

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "Karim",
    lastName: "Meziane",
    specialty: "Psychologie",
    bio: "Dr. Meziane est un psychologue expérimenté, spécialisé en thérapie cognitive et comportementale.",
    phone: "+213 661 45 78 90",
    email: "Meziane.karim@gmail.com",
    address: "Rue Hassiba Ben Bouali, Belouizdad, Alger 16015, Algérie",
  })

  const [accountForm, setAccountForm] = useState({
    username: "dr.Meziane",
    accountEmail: "Meziane.karim@gmail.com",
    language: "ar",
    timezone: "gmt+1",
  })

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isProfileEditing, setIsProfileEditing] = useState(false)
  const [isAccountEditing, setIsAccountEditing] = useState(false)
  const [isAvailabilityEditing, setIsAvailabilityEditing] = useState(false)
  const [isSpecialtiesEditing, setIsSpecialtiesEditing] = useState(false)
  const [isSecurityEditing, setIsSecurityEditing] = useState(false)
  const [isNotificationsEditing, setIsNotificationsEditing] = useState(false)

  // Handle navigation click
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
  }

  // Handle form submissions
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    showToastNotification("Profile updated successfully!", "success")
    setIsProfileEditing(false)
  }

  const handleAccountSubmit = (e) => {
    e.preventDefault()
    showToastNotification("Account settings updated successfully!", "success")
    setIsAccountEditing(false)
  }

  const handleAvailabilitySubmit = (e) => {
    e.preventDefault()
    showToastNotification("Availability settings updated successfully!", "success")
    setIsAvailabilityEditing(false)
  }

  const handleSpecialtiesSubmit = (e) => {
    e.preventDefault()
    showToastNotification("Specialties updated successfully!", "success")
    setIsSpecialtiesEditing(false)
  }

  const handleSecuritySubmit = (e) => {
    e.preventDefault()

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToastNotification("Passwords do not match!", "error")
      return
    }

    if (securityForm.newPassword.length < 8) {
      showToastNotification("Password must be at least 8 characters!", "error")
      return
    }

    showToastNotification("Password updated successfully!", "success")
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsSecurityEditing(false)
  }

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    })
  }

  // Handle account form changes
  const handleAccountChange = (e) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value,
    })
  }

  // Handle security form changes
  const handleSecurityChange = (e) => {
    setSecurityForm({
      ...securityForm,
      [e.target.name]: e.target.value,
    })
  }

  // Handle avatar upload
  const handleAvatarUpload = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target.result)
        showToastNotification("Profile photo updated!", "success")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar("https://randomuser.me/api/portraits/lego/1.jpg")
    showToastNotification("Profile photo removed!", "success")
  }

  // Handle specialties
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() !== "" && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (specialty) => {
    setSpecialties(specialties.filter((item) => item !== specialty))
  }

  // Handle availability changes
  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: field === "available" ? !availability[day].available : value,
      },
    })
  }

  // Toast notification
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Handle account deletion
  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = () => {
    // Check if the user typed "DELETE" in the confirmation input
    const deleteConfirmInput = document.getElementById("delete-confirm")
    if (deleteConfirmInput && deleteConfirmInput.value === "DELETE") {
      setShowDeleteModal(false)
      showToastNotification("Account has been scheduled for deletion. You will receive a confirmation email.", "error")
    } else {
      showToastNotification('Please type "DELETE" to confirm account deletion.', "error")
    }
  }

  // Handle specialty key press
  const handleSpecialtyKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSpecialty()
    }
  }

  const handleProfileEdit = () => {
    setIsProfileEditing(true)
  }

  const handleProfileCancel = () => {
    setIsProfileEditing(false)
    // Reset form to original values
  }

  const handleAccountEdit = () => {
    setIsAccountEditing(true)
  }

  const handleAccountCancel = () => {
    setIsAccountEditing(false)
    // Reset form to original values
  }

  const handleAvailabilityEdit = () => {
    setIsAvailabilityEditing(true)
  }

  const handleAvailabilityCancel = () => {
    setIsAvailabilityEditing(false)
    // Reset to original values - you would need to store the original state
  }

  const handleSpecialtiesEdit = () => {
    setIsSpecialtiesEditing(true)
  }

  const handleSpecialtiesCancel = () => {
    setIsSpecialtiesEditing(false)
    // Reset to original values
    setNewSpecialty("")
  }

  const handleSecurityEdit = () => {
    setIsSecurityEditing(true)
  }

  const handleSecurityCancel = () => {
    setIsSecurityEditing(false)
    // Reset form to original values
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleNotificationsEdit = () => {
    setIsNotificationsEditing(true)
  }

  const handleNotificationsCancel = () => {
    setIsNotificationsEditing(false)
    // Reset to original values
  }

  return (
    <div className="doctor-settings-page">
      <Sidebar />
      
      <div className="page-header">
      <ProfileDropdown />
        <h1>Doctor Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-nav">
          <ul>
            <li>
              <a
                href="#profile"
                className={`nav-link ${activeSection === "profile-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("profile-section")
                }}
              >
                <FaUser /> <span>Profile</span>
              </a>
            </li>
            <li>
              <a
                href="#account"
                className={`nav-link ${activeSection === "account-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("account-section")
                }}
              >
                <FaIdCard /> <span>Account</span>
              </a>
            </li>
            <li>
              <a
                href="#availability"
                className={`nav-link ${activeSection === "availability-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("availability-section")
                }}
              >
                <FaCalendarAlt /> <span>Availability</span>
              </a>
            </li>
            <li>
              <a
                href="#specialties"
                className={`nav-link ${activeSection === "specialties-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("specialties-section")
                }}
              >
                <FaStethoscope /> <span>Specialties</span>
              </a>
            </li>
            <li>
              <a
                href="#notifications"
                className={`nav-link ${activeSection === "notifications-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("notifications-section")
                }}
              >
                <FaBell /> <span>Notifications</span>
              </a>
            </li>
            <li>
              <a
                href="#security"
                className={`nav-link ${activeSection === "security-section" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("security-section")
                }}
              >
                <FaShieldAlt /> <span>Security</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="settings-content">
          {/* Profile Section */}
          <div
            id="profile-section"
            className={`settings-section ${activeSection === "profile-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Profile Information</h2>
            <div className="profile-info">
              <div className="avatar-container">
                <img src={avatar || "/Images/dr-face3.png"} alt="Doctor Avatar" className="avatar" id="preview-avatar" />
                <div className="avatar-actions">
                  <button type="button" className="btn-primary" onClick={handleAvatarUpload}>
                    Upload New Photo
                  </button>
                  <button type="button" className="secondary" onClick={handleRemoveAvatar}>
                    Remove Photo
                  </button>
                  <input
                    type="file"
                    id="avatar-input"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="profile-details">
                <form id="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        disabled={!isProfileEditing}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        disabled={!isProfileEditing}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty">Primary Specialty</label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={profileForm.specialty}
                      onChange={handleProfileChange}
                      disabled={!isProfileEditing}
                    >
                      <option value="cardiologist">Cardiologist</option>
                      <option value="dermatologist">Dermatologist</option>
                      <option value="neurologist">Neurologist</option>
                      <option value="pediatrician">Pediatrician</option>
                      <option value="psychiatrist">Psychiatrist</option>
                      <option value="surgeon">Surgeon</option>
                      <option value="Psychologie">psychologue</option>

                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Professional Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="5"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      disabled={!isProfileEditing}
                    ></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        disabled={!isProfileEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled={!isProfileEditing}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Office Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      disabled={!isProfileEditing}
                    />
                  </div>
                  <div className="form-actions">
                    {!isProfileEditing ? (
                      <button type="button" className="btn btn-secondary" onClick={handleProfileEdit}>
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button type="button" className="btn btn-secondary" onClick={handleProfileCancel}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div
            id="account-section"
            className={`settings-section ${activeSection === "account-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Account Settings</h2>
            <form id="account-form" onSubmit={handleAccountSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={accountForm.username}
                    onChange={handleAccountChange}
                    disabled={!isAccountEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accountEmail">Email Address</label>
                  <input
                    type="email"
                    id="accountEmail"
                    name="accountEmail"
                    value={accountForm.accountEmail}
                    onChange={handleAccountChange}
                    disabled={!isAccountEditing}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="language">Preferred Language</label>
                <select
                  id="language"
                  name="language"
                  value={accountForm.language}
                  onChange={handleAccountChange}
                  disabled={!isAccountEditing}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={accountForm.timezone}
                  onChange={handleAccountChange}
                  disabled={!isAccountEditing}
                >
                  <option value="est">Eastern Time (ET)</option>
                  <option value="cst">Central Time (CT)</option>
                  <option value="mst">Mountain Time (MT)</option>
                  <option value="pst">Pacific Time (PT)</option>
                  <option value="gmt">Greenwich Mean Time (GMT)</option>
                  <option value="gmt+1">Greenwich Mean time + 1 (GMT+1)</option>
                </select>
              </div>
              <div className="form-actions">
                {!isAccountEditing ? (
                  <button type="button" className="btn btn-secondary" onClick={handleAccountEdit}>
                    Edit Account
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleAccountCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Deleting your account will remove all of your information from our database. This cannot be undone.</p>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>

          {/* Availability Section */}
          <div
            id="availability-section"
            className={`settings-section ${activeSection === "availability-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Work Hours & Availability</h2>
            <form id="availability-form" onSubmit={handleAvailabilitySubmit}>
              <div className="working-hours">
                {Object.entries(availability).map(([day, dayData]) => (
                  <div className="day-hours" key={day}>
                    <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name={`${day}-available`}
                        checked={dayData.available}
                        onChange={() => handleAvailabilityChange(day, "available")}
                        disabled={!isAvailabilityEditing}
                      />
                      <span className="slider"></span>
                    </label>
                    <div className="day-hours-inputs">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Start Time</label>
                          <input
                            type="time"
                            name={`${day}-start`}
                            value={dayData.start}
                            onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                            disabled={!dayData.available || !isAvailabilityEditing}
                          />
                        </div>
                        <div className="form-group">
                          <label>End Time</label>
                          <input
                            type="time"
                            name={`${day}-end`}
                            value={dayData.end}
                            onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                            disabled={!dayData.available || !isAvailabilityEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                {!isAvailabilityEditing ? (
                  <button type="button" className="btn btn-secondary" onClick={handleAvailabilityEdit}>
                    Edit Availability
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleAvailabilityCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Specialties Section */}
          <div
            id="specialties-section"
            className={`settings-section ${activeSection === "specialties-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Specialties & Expertise</h2>
            <form id="specialties-form" onSubmit={handleSpecialtiesSubmit}>
              <div className="form-group">
                <label>Your Specialties</label>
                <div className="specialty-container">
                  {specialties.map((specialty, index) => (
                    <span className="specialty-tag" key={index}>
                      {specialty}
                      {isSpecialtiesEditing && (
                        <button type="button" onClick={() => handleRemoveSpecialty(specialty)}>
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isSpecialtiesEditing && (
                  <div className="add-specialty">
                    <input
                      type="text"
                      placeholder="Add a specialty"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={handleSpecialtyKeyPress}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleAddSpecialty}>
                      Add
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="services">Services Offered</label>
                <textarea
                  id="services"
                  name="services"
                  rows="4"
                  defaultValue="Consultations psychologiques,Thérapie cognitivo-comportementale (TCC),Gestion du stress et de l’anxiété,Traitement de la dépression,Accompagnement en cas de burn-out,Thérapie de couple et familiale"
                  disabled={!isSpecialtiesEditing}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="education">Education & Certifications</label>
                <textarea
                  id="education"
                  name="education"
                  rows="4"
                  defaultValue="Doctorat en Psychologie, Université d'Alger
Spécialisation en Psychologie Clinique
Formation en Thérapie Cognitivo-Comportementale (TCC), Institut National de Psychologie
Expert en Gestion du Stress et des Troubles Anxieux"
                  disabled={!isSpecialtiesEditing}
                ></textarea>
              </div>
              <div className="form-actions">
                {!isSpecialtiesEditing ? (
                  <button type="button" className="btn btn-secondary" onClick={handleSpecialtiesEdit}>
                    Edit Specialties
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleSpecialtiesCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Notifications Section */}
          <div
            id="notifications-section"
            className={`settings-section ${activeSection === "notifications-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Notification Preferences</h2>
            <div className="notification-options">
              <div className="notification-option">
                <div className="notification-details">
                  <div className="notification-title">Email Notifications</div>
                  <div className="notification-description">
                    Receive notifications about new appointments, cancellations, and reminders via email.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked disabled={!isNotificationsEditing} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="notification-option">
                <div className="notification-details">
                  <div className="notification-title">SMS Notifications</div>
                  <div className="notification-description">
                    Receive text messages for appointment reminders and updates.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked disabled={!isNotificationsEditing} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="notification-option">
                <div className="notification-details">
                  <div className="notification-title">App Notifications</div>
                  <div className="notification-description">Receive push notifications in the mobile app.</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked disabled={!isNotificationsEditing} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="notification-option">
                <div className="notification-details">
                  <div className="notification-title">Patient Reviews</div>
                  <div className="notification-description">Be notified when a patient leaves a review for you.</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked disabled={!isNotificationsEditing} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="notification-option">
                <div className="notification-details">
                  <div className="notification-title">Marketing Updates</div>
                  <div className="notification-description">
                    Receive updates about new features, promotions, and news.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" disabled={!isNotificationsEditing} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className="form-actions">
              {!isNotificationsEditing ? (
                <button type="button" className="btn btn-secondary" onClick={handleNotificationsEdit}>
                  Edit Notifications
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-secondary" onClick={handleNotificationsCancel}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      showToastNotification("Notification preferences updated successfully!", "success")
                      setIsNotificationsEditing(false)
                    }}
                  >
                    Save Preferences
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div
            id="security-section"
            className={`settings-section ${activeSection === "security-section" ? "active" : ""}`}
          >
            <h2 className="section-title">Security Settings</h2>
            <div className="password-section">
              <form id="password-form" onSubmit={handleSecuritySubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    disabled={!isSecurityEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    disabled={!isSecurityEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    disabled={!isSecurityEditing}
                    required
                  />
                </div>
                <div className="form-actions">
                  {!isSecurityEditing ? (
                    <button type="button" className="btn btn-secondary" onClick={handleSecurityEdit}>
                      Edit Password
                    </button>
                  ) : (
                    <>
                      <button type="button" className="btn btn-secondary" onClick={handleSecurityCancel}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Password
                      </button>
                    </>
                  )}
                </div>
              </form>

              <div className="form-group" style={{ marginTop: "2rem" }}>
                <h3>Two-Factor Authentication</h3>
                <p style={{ marginBottom: "1rem" }}>Add an extra layer of security to your account.</p>
                <button className="btn btn-secondary">Enable Two-Factor Authentication</button>
              </div>

              <div className="form-group" style={{ marginTop: "2rem" }}>
                <h3>Login Sessions</h3>
                <p style={{ marginBottom: "1rem" }}>Manage your active sessions and sign out from other devices.</p>
                <button className="btn btn-secondary">Manage Sessions</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <div className={`modal-overlay ${showDeleteModal ? "active" : ""}`}>
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">Delete Account</h3>
            <button className="close-modal" onClick={() => setShowDeleteModal(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete your account? This action cannot be undone and will result in the
              permanent loss of your account data, patient relationships, and appointment history.
            </p>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="delete-confirm">Type "DELETE" to confirm</label>
              <input type="text" id="delete-confirm" />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""} ${toastType}`}>
        {toastType === "success" ? <FaCheck /> : <FaTimes />}
        <span>{toastMessage}</span>
      </div>
    </div>
  )
}

export default DoctorSettings

