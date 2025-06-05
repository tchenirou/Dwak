"use client"

import { useState } from "react"
import {
  Save,
  X,
  Bell,
  Shield,
  Globe,
  Mail,
  User,
  Settings,
  Database,
  FileText,
  Moon,
  Sun,
  Upload,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Clock,
  DollarSign,
  Sliders,
} from "lucide-react"
import "./AdminSettings.css"
import Sidebar from "../../../../component/SideBar/AdminSideBar/AdminSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"

const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  const openModal = (title, message, onConfirm) => {
    setModal({ show: true, title, message, onConfirm });
  };

  const closeModal = () => {
    setModal({ show: false, title: "", message: "", onConfirm: null });
  };

  const confirmAction = () => {
    if (modal.onConfirm) modal.onConfirm();
    closeModal();
  };
  // State for active tab
  const [activeTab, setActiveTab] = useState("account")


    // Handle delete account confirmation
    const handleDeleteAccount = () => {
      if (window.confirm("Are you sure you want to delete your account? This action is irreversible!")) {
        setAlert({ show: true, message: "Account deleted permanently.", type: "danger" });
      }
    };
  
    // Handle restore system confirmation
    const handleRestoreSystem = () => {
      if (window.confirm("Restoring will overwrite your current system settings. Proceed?")) {
        setAlert({ show: true, message: "System restored successfully.", type: "success" });
      }
    };
  
    // Handle reset settings confirmation
    const handleResetSettings = () => {
      if (window.confirm("Resetting settings will revert everything to default values. Continue?")) {
        setAlert({ show: true, message: "Settings reset successfully.", type: "success" });
      }
    };
     // Handle purge data confirmation
  const handlePurgeData = () => {
    if (window.confirm("Warning! This will delete ALL data permanently. Do you want to proceed?")) {
      setAlert({ show: true, message: "All data purged successfully.", type: "danger" });
    }
  };

  // State for form data
  const [accountSettings, setAccountSettings] = useState({
    name: "Admin User",
    email: "admin@healthcare.com",
    phone: "+213 555 123 456",
    avatar: "/placeholder.svg?height=200&width=200",
    language: "en",
    timezone: "Africa/Algiers",
  })

  const [systemSettings, setSystemSettings] = useState({
    siteName: "Healthcare Platform",
    siteDescription: "A comprehensive healthcare management system",
    contactEmail: "contact@healthcare.com",
    supportPhone: "+213 555 789 012",
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: "en",
    defaultTimezone: "Africa/Algiers",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
    systemUpdates: true,
    newDoctorAlerts: true,
    newPatientAlerts: true,
    securityAlerts: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    minimumPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    loginAttempts: 5,
    ipRestriction: false,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    enablePaymentGateway: true,
    paymentGatewayKey: "pk_test_51HG7vYKXXXXXXXXXXXXXXXXXX",
    enableSMSGateway: false,
    smsGatewayKey: "",
    enableEmailService: true,
    emailServiceKey: "SG.XXXXXXXXXXXXXXXXXXXXXXXX",
    enableGoogleCalendar: false,
    googleCalendarKey: "",
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    includeFiles: true,
    includeDatabase: true,
    backupLocation: "cloud",
    lastBackup: "2023-10-15 08:30:22",
  })

  // State for avatar preview
  const [avatarPreview, setAvatarPreview] = useState(accountSettings.avatar)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("No file chosen")

  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  // State for unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Handle file change for avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target.result)
        setAccountSettings({
          ...accountSettings,
          avatar: event.target.result,
        })
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle account form change
  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountSettings({
      ...accountSettings,
      [name]: value,
    })
    setHasUnsavedChanges(true)
  }

  // Handle system settings change
  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target
    setSystemSettings({
      ...systemSettings,
      [name]: type === "checkbox" ? checked : value,
    })
    setHasUnsavedChanges(true)
  }

  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
    setHasUnsavedChanges(true)
  }

  // Handle security settings change
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target
    setSecuritySettings({
      ...securitySettings,
      [name]: type === "checkbox" ? checked : value,
    })
    setHasUnsavedChanges(true)
  }

  // Handle integration settings change
  const handleIntegrationChange = (e) => {
    const { name, value, type, checked } = e.target
    setIntegrationSettings({
      ...integrationSettings,
      [name]: type === "checkbox" ? checked : value,
    })
    setHasUnsavedChanges(true)
  }

  // Handle backup settings change
  const handleBackupChange = (e) => {
    const { name, value, type, checked } = e.target
    setBackupSettings({
      ...backupSettings,
      [name]: type === "checkbox" ? checked : value,
    })
    setHasUnsavedChanges(true)
  }

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    setAlert({
      show: true,
      message: "Settings saved successfully!",
      type: "success",
    })

    setHasUnsavedChanges(false)

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle discard changes
  const handleDiscardChanges = () => {
    // Reset to original values (would fetch from backend in real app)
    // For now, just show an alert
    setAlert({
      show: true,
      message: "Changes discarded.",
      type: "info",
    })

    setHasUnsavedChanges(false)

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle backup now
  const handleBackupNow = () => {
    // In a real app, this would trigger a backup
    setAlert({
      show: true,
      message: "Backup started. This may take a few minutes.",
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Available languages
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "ar", name: "Arabic" },
    { code: "es", name: "Spanish" },
  ]

  // Available timezones
  const timezones = [
    { code: "Africa/Algiers", name: "Algiers (GMT+1)" },
    { code: "Europe/Paris", name: "Paris (GMT+1)" },
    { code: "Europe/London", name: "London (GMT+0)" },
    { code: "America/New_York", name: "New York (GMT-5)" },
    { code: "Asia/Dubai", name: "Dubai (GMT+4)" },
  ]

  // Available colors
  const colorOptions = [
    { value: "#3d56f5", label: "Blue (Default)" },
    { value: "#22c55e", label: "Green" },
    { value: "#ef4444", label: "Red" },
    { value: "#f59e0b", label: "Orange" },
    { value: "#8b5cf6", label: "Purple" },
  ]

  return (
    <div className="admin-settings-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <ProfileDropdown />

        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Configure your system preferences and account settings</p>
          </div>

          {hasUnsavedChanges && (
            <div className="header-actions">
              <button className="discard-button" onClick={handleDiscardChanges}>
                <X size={16} />
                Discard
              </button>
              <button className="save-button" onClick={handleSaveSettings}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Settings Navigation */}
        <div className="settings-nav">
          <button
            className={`settings-nav-item ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <User size={16} />
            Account
          </button>
          <button
            className={`settings-nav-item ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <Settings size={16} />
            System
          </button>
          <button
            className={`settings-nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={16} />
            Notifications
          </button>
          <button
            className={`settings-nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield size={16} />
            Security
          </button>
          <button
            className={`settings-nav-item ${activeTab === "integrations" ? "active" : ""}`}
            onClick={() => setActiveTab("integrations")}
          >
            <Globe size={16} />
            Integrations
          </button>
          <button
            className={`settings-nav-item ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
          >
            <Database size={16} />
            Backup & Restore
          </button>
        </div>

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Account Information</h2>
                <p className="settings-section-description">Update your personal information and preferences</p>
              </div>

              <div className="settings-form">
                <div className="form-group avatar-group">
                  <label>Profile Photo</label>
                  <div className="avatar-upload">
                    <img src={avatarPreview || "/placeholder.svg"} alt="Profile Avatar" className="avatar-preview" />
                    <div className="avatar-upload-controls">
                      <div className="file-upload">
                        <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} />
                        <label htmlFor="avatar" className="file-upload-label">
                          <Upload size={16} />
                          Change Photo
                        </label>
                        <span className="file-name">{fileName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={accountSettings.name}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={accountSettings.email}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={accountSettings.phone}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={accountSettings.language}
                      onChange={handleAccountChange}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select id="timezone" name="timezone" value={accountSettings.timezone} onChange={handleAccountChange}>
                    {timezones.map((tz) => (
                      <option key={tz.code} value={tz.code}>
                        {tz.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-section danger-zone">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Danger Zone</h2>
                <p className="settings-section-description">Irreversible and destructive actions</p>
              </div>

              <div className="danger-actions">
                <div className="danger-action">
                  <div className="danger-action-info">
                    <h3>Reset Account</h3>
                    <p>Reset your account settings to default. This will not delete any data.</p>
                  </div>
                  <button className="btn-warning" onClick={() => openModal("Reset Account", "Are you sure you want to reset your account settings? This will restore default settings.", () => alert("Account reset!"))}>Reset Account</button>
                </div>

                <div className="danger-action">
                  <div className="danger-action-info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                  </div>
                  <button className="btn-danger" onClick={() => openModal("Delete Account", "Are you sure you want to delete your account? This action is irreversible!", () => alert("Account deleted!"))}>Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === "system" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">System Configuration</h2>
                <p className="settings-section-description">Configure general system settings</p>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="siteName">Site Name</label>
                    <input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={systemSettings.siteName}
                      onChange={handleSystemChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={systemSettings.contactEmail}
                      onChange={handleSystemChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="siteDescription">Site Description</label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={systemSettings.siteDescription}
                    onChange={handleSystemChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="supportPhone">Support Phone</label>
                    <input
                      type="tel"
                      id="supportPhone"
                      name="supportPhone"
                      value={systemSettings.supportPhone}
                      onChange={handleSystemChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="defaultLanguage">Default Language</label>
                    <select
                      id="defaultLanguage"
                      name="defaultLanguage"
                      value={systemSettings.defaultLanguage}
                      onChange={handleSystemChange}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="defaultTimezone">Default Timezone</label>
                    <select
                      id="defaultTimezone"
                      name="defaultTimezone"
                      value={systemSettings.defaultTimezone}
                      onChange={handleSystemChange}
                    >
                      {timezones.map((tz) => (
                        <option key={tz.code} value={tz.code}>
                          {tz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateFormat">Date Format</label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={systemSettings.dateFormat}
                      onChange={handleSystemChange}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="timeFormat">Time Format</label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      value={systemSettings.timeFormat}
                      onChange={handleSystemChange}
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="empty-label"></label>
                    <div className="toggle-container">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={systemSettings.maintenanceMode}
                          onChange={handleSystemChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">Maintenance Mode</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="allowRegistration"
                        checked={systemSettings.allowRegistration}
                        onChange={handleSystemChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Allow New User Registration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Notification Preferences</h2>
                <p className="settings-section-description">Configure how and when you receive notifications</p>
              </div>

              <div className="settings-form">
                <div className="notification-group">
                  <h3 className="notification-group-title">
                    <Mail size={18} />
                    Email Notifications
                  </h3>

                  <div className="notification-options">
                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>Marketing Emails</h4>
                        <p>Receive promotional emails and newsletters</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="marketingEmails"
                          checked={notificationSettings.marketingEmails}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-group">
                  <h3 className="notification-group-title">
                    <Smartphone size={18} />
                    SMS Notifications
                  </h3>

                  <div className="notification-options">
                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>SMS Notifications</h4>
                        <p>Receive notifications via SMS</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>Appointment Reminders</h4>
                        <p>Receive reminders about upcoming appointments</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="appointmentReminders"
                          checked={notificationSettings.appointmentReminders}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-group">
                  <h3 className="notification-group-title">
                    <Bell size={18} />
                    System Notifications
                  </h3>

                  <div className="notification-options">
                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>System Updates</h4>
                        <p>Receive notifications about system updates and maintenance</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="systemUpdates"
                          checked={notificationSettings.systemUpdates}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>New Doctor Alerts</h4>
                        <p>Receive notifications when new doctors register</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newDoctorAlerts"
                          checked={notificationSettings.newDoctorAlerts}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>New Patient Alerts</h4>
                        <p>Receive notifications when new patients register</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="newPatientAlerts"
                          checked={notificationSettings.newPatientAlerts}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-option">
                      <div className="notification-info">
                        <h4>Security Alerts</h4>
                        <p>Receive notifications about security-related events</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="securityAlerts"
                          checked={notificationSettings.securityAlerts}
                          onChange={handleNotificationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Security Settings</h2>
                <p className="settings-section-description">
                  Configure security options to protect your account and data
                </p>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-info">
                      <span className="toggle-label">Two-Factor Authentication</span>
                      <span className="toggle-description">Add an extra layer of security to your account</span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      id="sessionTimeout"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      min="5"
                      max="240"
                    />
                    <span className="form-help">Time before automatic logout due to inactivity</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="passwordExpiry">Password Expiry (days)</label>
                    <input
                      type="number"
                      id="passwordExpiry"
                      name="passwordExpiry"
                      value={securitySettings.passwordExpiry}
                      onChange={handleSecurityChange}
                      min="0"
                      max="365"
                    />
                    <span className="form-help">Days before password must be changed (0 = never)</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="minimumPasswordLength">Minimum Password Length</label>
                    <input
                      type="number"
                      id="minimumPasswordLength"
                      name="minimumPasswordLength"
                      value={securitySettings.minimumPasswordLength}
                      onChange={handleSecurityChange}
                      min="6"
                      max="32"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginAttempts">Max Login Attempts</label>
                    <input
                      type="number"
                      id="loginAttempts"
                      name="loginAttempts"
                      value={securitySettings.loginAttempts}
                      onChange={handleSecurityChange}
                      min="3"
                      max="10"
                    />
                    <span className="form-help">Number of failed attempts before account lockout</span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="requireSpecialChars"
                        checked={securitySettings.requireSpecialChars}
                        onChange={handleSecurityChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Require Special Characters in Password</span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="requireNumbers"
                        checked={securitySettings.requireNumbers}
                        onChange={handleSecurityChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Require Numbers in Password</span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="ipRestriction"
                        checked={securitySettings.ipRestriction}
                        onChange={handleSecurityChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Enable IP Restriction</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-primary">Change Password</button>
                  <button className="btn-secondary">View Login History</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Integration Settings */}
        {activeTab === "integrations" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Integration Settings</h2>
                <p className="settings-section-description">Configure third-party service integrations</p>
              </div>

              <div className="settings-form">
                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon payment-icon">
                      <DollarSign size={24} />
                    </div>
                    <div className="integration-info">
                      <h3>Payment Gateway</h3>
                      <p>Configure payment processing for appointments and services</p>
                    </div>
                    <div className="integration-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="enablePaymentGateway"
                          checked={integrationSettings.enablePaymentGateway}
                          onChange={handleIntegrationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {integrationSettings.enablePaymentGateway && (
                    <div className="integration-details">
                      <div className="form-group">
                        <label htmlFor="paymentGatewayKey">API Key</label>
                        <input
                          type="text"
                          id="paymentGatewayKey"
                          name="paymentGatewayKey"
                          value={integrationSettings.paymentGatewayKey}
                          onChange={handleIntegrationChange}
                        />
                      </div>
                      <div className="integration-actions">
                        <button className="btn-secondary">Test Connection</button>
                        <button className="btn-primary">Configure Settings</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon sms-icon">
                      <Smartphone size={24} />
                    </div>
                    <div className="integration-info">
                      <h3>SMS Gateway</h3>
                      <p>Configure SMS notifications for appointments and reminders</p>
                    </div>
                    <div className="integration-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="enableSMSGateway"
                          checked={integrationSettings.enableSMSGateway}
                          onChange={handleIntegrationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {integrationSettings.enableSMSGateway && (
                    <div className="integration-details">
                      <div className="form-group">
                        <label htmlFor="smsGatewayKey">API Key</label>
                        <input
                          type="text"
                          id="smsGatewayKey"
                          name="smsGatewayKey"
                          value={integrationSettings.smsGatewayKey}
                          onChange={handleIntegrationChange}
                        />
                      </div>
                      <div className="integration-actions">
                        <button className="btn-secondary">Test Connection</button>
                        <button className="btn-primary">Configure Settings</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon email-icon">
                      <Mail size={24} />
                    </div>
                    <div className="integration-info">
                      <h3>Email Service</h3>
                      <p>Configure email service for notifications and communications</p>
                    </div>
                    <div className="integration-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="enableEmailService"
                          checked={integrationSettings.enableEmailService}
                          onChange={handleIntegrationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {integrationSettings.enableEmailService && (
                    <div className="integration-details">
                      <div className="form-group">
                        <label htmlFor="emailServiceKey">API Key</label>
                        <input
                          type="text"
                          id="emailServiceKey"
                          name="emailServiceKey"
                          value={integrationSettings.emailServiceKey}
                          onChange={handleIntegrationChange}
                        />
                      </div>
                      <div className="integration-actions">
                        <button className="btn-secondary">Test Connection</button>
                        <button className="btn-primary">Configure Settings</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon calendar-icon">
                      <Clock size={24} />
                    </div>
                    <div className="integration-info">
                      <h3>Google Calendar</h3>
                      <p>Sync appointments with Google Calendar</p>
                    </div>
                    <div className="integration-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="enableGoogleCalendar"
                          checked={integrationSettings.enableGoogleCalendar}
                          onChange={handleIntegrationChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {integrationSettings.enableGoogleCalendar && (
                    <div className="integration-details">
                      <div className="form-group">
                        <label htmlFor="googleCalendarKey">API Key</label>
                        <input
                          type="text"
                          id="googleCalendarKey"
                          name="googleCalendarKey"
                          value={integrationSettings.googleCalendarKey}
                          onChange={handleIntegrationChange}
                        />
                      </div>
                      <div className="integration-actions">
                        <button className="btn-secondary">Test Connection</button>
                        <button className="btn-primary">Configure Settings</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup & Restore Settings */}
        {activeTab === "backup" && (
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Backup & Restore</h2>
                <p className="settings-section-description">Configure automatic backups and restore data</p>
              </div>

              <div className="settings-form">
                <div className="backup-status">
                  <div className="backup-info">
                    <h3>Last Backup</h3>
                    <p>{backupSettings.lastBackup}</p>
                  </div>
                  <button className="btn-primary" onClick={handleBackupNow}>
                    Backup Now
                  </button>
                </div>

                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="autoBackup"
                        checked={backupSettings.autoBackup}
                        onChange={handleBackupChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Automatic Backups</span>
                  </div>
                </div>

                {backupSettings.autoBackup && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="backupFrequency">Backup Frequency</label>
                        <select
                          id="backupFrequency"
                          name="backupFrequency"
                          value={backupSettings.backupFrequency}
                          onChange={handleBackupChange}
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="backupRetention">Retention Period (days)</label>
                        <input
                          type="number"
                          id="backupRetention"
                          name="backupRetention"
                          value={backupSettings.backupRetention}
                          onChange={handleBackupChange}
                          min="1"
                          max="365"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="backupLocation">Backup Location</label>
                        <select
                          id="backupLocation"
                          name="backupLocation"
                          value={backupSettings.backupLocation}
                          onChange={handleBackupChange}
                        >
                          <option value="local">Local Storage</option>
                          <option value="cloud">Cloud Storage</option>
                          <option value="both">Both (Local & Cloud)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="empty-label"></label>
                        <div className="checkbox-group">
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              id="includeFiles"
                              name="includeFiles"
                              checked={backupSettings.includeFiles}
                              onChange={handleBackupChange}
                            />
                            <label htmlFor="includeFiles">Include Files</label>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              id="includeDatabase"
                              name="includeDatabase"
                              checked={backupSettings.includeDatabase}
                              onChange={handleBackupChange}
                            />
                            <label htmlFor="includeDatabase">Include Database</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="backup-actions">
                  <button className="btn-secondary">
                    <Upload size={16} />
                    Upload Backup
                  </button>
                  <button className="btn-secondary">
                    <FileText size={16} />
                    View Backup History
                  </button>
                </div>

                <div className="danger-zone">
                  <h3 className="danger-zone-title">Danger Zone</h3>
                  <p className="danger-zone-description">These actions are destructive and cannot be undone</p>

                  <div className="danger-actions">
                    <div className="danger-action">
                      <div className="danger-action-info">
                        <h3>Restore from Backup</h3>
                        <p>Restore your system from a previous backup. Current data will be overwritten.</p>
                      </div>
                      <button className="btn-warning" onClick={() => openModal("Restore System", "Restoring will overwrite your current system settings. Proceed?", () => alert("System restored!"))}>Restore System</button>
                    </div>

                    <div className="danger-action">
                      <div className="danger-action-info">
                        <h3>Reset to Factory Settings</h3>
                        <p>Reset all settings to default values. This will not delete your data.</p>
                      </div>
                      <button className="btn-warning" onClick={() => openModal("Reset Settings", "Resetting settings will revert everything to default values. Continue?", () => alert("Settings reset!"))}>Reset Settings</button>
                    </div>

                    <div className="danger-action">
                      <div className="danger-action-info">
                        <h3>Purge All Data</h3>
                        <p>Permanently delete all data from the system. This action cannot be undone.</p>
                      </div>
                      <button className="btn-danger" onClick={() => openModal("Purge All Data", "Warning! This will delete ALL data permanently. Do you want to proceed?", () => alert("All data purged!"))}>Purge Data</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert Notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}
      {modal.show && (
        <Modal title={modal.title} message={modal.message} onConfirm={confirmAction} onCancel={closeModal} />
      )}
    </div>
  )
}

export default AdminSettings

