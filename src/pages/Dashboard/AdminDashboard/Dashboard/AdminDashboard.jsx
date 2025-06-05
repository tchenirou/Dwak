"use client"

import { useState, useEffect } from "react"
import {
  FiUsers,
  FiCalendar,
  FiStar,
  FiSearch,
  FiPlus,
  FiCheck,
  FiX,
  FiEdit,
  FiEye,
  FiTrash2,
  FiUserPlus,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi"
import AdminSideBar from "../../../../component/SideBar/AdminSideBar/AdminSideBar"
import "./AdminDashboard.css"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("")
  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionDoctorId, setActionDoctorId] = useState(null)
  const [actionMessage, setActionMessage] = useState("")
  const [alert, setAlert] = useState(null)
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    patients: 0,
    rating: 4.5,
    status: "pending",
  })

  // First, add these new state variables at the top of the component, after the existing state declarations
  const [showDoctorDetailsModal, setShowDoctorDetailsModal] = useState(false)
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false)
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Data state (converted from static data to state for dynamic updates)
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      patients: 124,
      rating: 4.9,
      status: "active",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      patients: 98,
      rating: 4.7,
      status: "active",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      patients: 156,
      rating: 4.8,
      status: "active",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Dr. David Kim",
      specialty: "Dermatologist",
      patients: 87,
      rating: 4.5,
      status: "active",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Dr. Jessica Patel",
      specialty: "Orthopedic Surgeon",
      patients: 62,
      rating: 4.6,
      status: "pending",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Dr. Robert Wilson",
      specialty: "Ophthalmologist",
      patients: 43,
      rating: 4.4,
      status: "suspended",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Dr. Lisa Thompson",
      specialty: "Psychiatrist",
      patients: 78,
      rating: 4.7,
      status: "pending",
      img: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    totalPatients: 345,
    totalAppointments: 1245,
  })

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Alice Johnson",
      doctor: "Dr. Sarah Johnson",
      date: "2023-10-15",
      time: "09:30 AM",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Bob Smith",
      doctor: "Dr. Michael Chen",
      date: "2023-10-15",
      time: "11:00 AM",
      status: "pending",
    },
    {
      id: 3,
      patient: "Carol Davis",
      doctor: "Dr. Emily Rodriguez",
      date: "2023-10-16",
      time: "10:15 AM",
      status: "confirmed",
    },
    {
      id: 4,
      patient: "Daniel Wilson",
      doctor: "Dr. David Kim",
      date: "2023-10-16",
      time: "02:30 PM",
      status: "pending",
    },
    {
      id: 5,
      patient: "Eva Martinez",
      doctor: "Dr. Sarah Johnson",
      date: "2023-10-17",
      time: "03:45 PM",
      status: "confirmed",
    },
  ])

  const patients = [
    {
      id: 1,
      name: "Alice Johnson",
      age: 35,
      lastVisit: "2023-09-30",
      doctor: "Dr. Sarah Johnson",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Bob Smith",
      age: 42,
      lastVisit: "2023-10-02",
      doctor: "Dr. Michael Chen",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Carol Davis",
      age: 28,
      lastVisit: "2023-10-05",
      doctor: "Dr. Emily Rodriguez",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Daniel Wilson",
      age: 50,
      lastVisit: "2023-10-07",
      doctor: "Dr. David Kim",
      img: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Eva Martinez",
      age: 33,
      lastVisit: "2023-10-10",
      doctor: "Dr. Sarah Johnson",
      img: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Update stats whenever doctors or appointments change
  useEffect(() => {
    const activeDoctorsCount = doctors.filter((doctor) => doctor.status === "active").length
    const pendingDoctorsCount = doctors.filter((doctor) => doctor.status === "pending").length

    setStats({
      totalDoctors: doctors.length,
      activeDoctors: activeDoctorsCount,
      totalPatients: 345, // Would be dynamic in a real app
      totalAppointments: appointments.length,
    })
  }, [doctors, appointments])

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase()),
  )

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(patientSearchQuery.toLowerCase()),
  )

  // Function to handle adding a new doctor
  const handleAddDoctor = () => {
    const newId = Math.max(...doctors.map((doctor) => doctor.id)) + 1
    const doctorToAdd = {
      ...newDoctor,
      id: newId,
      img: "/placeholder.svg?height=40&width=40",
    }

    setDoctors([...doctors, doctorToAdd])
    setNewDoctor({
      name: "",
      specialty: "",
      patients: 0,
      rating: 4.5,
      status: "pending",
    })
    setShowAddDoctorModal(false)

    showAlert({
      type: "success",
      message: `Dr. ${doctorToAdd.name} has been added successfully!`,
    })
  }

  // Function to handle deleting a doctor
  const handleDeleteDoctor = (id) => {
    setActionDoctorId(id)
    setConfirmAction("delete")
    setActionMessage("Are you sure you want to delete this doctor? This action cannot be undone.")
    setShowConfirmModal(true)
  }

  // Function to confirm doctor deletion
  const confirmDeleteDoctor = () => {
    const doctorToDelete = doctors.find((doctor) => doctor.id === actionDoctorId)
    setDoctors(doctors.filter((doctor) => doctor.id !== actionDoctorId))
    setShowConfirmModal(false)

    showAlert({
      type: "success",
      message: `Dr. ${doctorToDelete.name} has been deleted successfully!`,
    })
  }

  // Function to handle changing a doctor's status
  const handleDoctorStatus = (id, newStatus) => {
    setActionDoctorId(id)
    setConfirmAction(newStatus)

    let message = ""
    if (newStatus === "suspend") {
      message = "Are you sure you want to suspend this doctor?"
    } else if (newStatus === "activate") {
      message = "Are you sure you want to activate this doctor?"
    }

    setActionMessage(message)
    setShowConfirmModal(true)
  }

  // Function to confirm doctor status change
  const confirmStatusChange = () => {
    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id === actionDoctorId) {
        let newStatus = ""

        if (confirmAction === "suspend") {
          newStatus = "suspended"
        } else if (confirmAction === "activate") {
          newStatus = "active"
        }

        return { ...doctor, status: newStatus }
      }
      return doctor
    })

    const doctorName = doctors.find((doctor) => doctor.id === actionDoctorId).name
    setDoctors(updatedDoctors)
    setShowConfirmModal(false)

    showAlert({
      type: "success",
      message: `Dr. ${doctorName}'s status has been updated successfully!`,
    })
  }

  // Function to handle approving a pending doctor
  const handleApprovePendingDoctor = (id) => {
    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id === id) {
        return { ...doctor, status: "active" }
      }
      return doctor
    })

    const doctorName = doctors.find((doctor) => doctor.id === id).name
    setDoctors(updatedDoctors)

    showAlert({
      type: "success",
      message: `Dr. ${doctorName} has been approved successfully!`,
    })
  }

  // Function to handle rejecting a pending doctor
  const handleRejectPendingDoctor = (id) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== id)
    const doctorName = doctors.find((doctor) => doctor.id === id).name
    setDoctors(updatedDoctors)

    showAlert({
      type: "success",
      message: `Dr. ${doctorName}'s application has been rejected.`,
    })
  }

  // Function to show an alert
  const showAlert = (alertData) => {
    setAlert(alertData)
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  // Function to handle confirming or canceling an appointment
  const handleAppointmentStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return { ...appointment, status: newStatus }
      }
      return appointment
    })

    setAppointments(updatedAppointments)

    showAlert({
      type: "success",
      message: `Appointment has been ${newStatus} successfully!`,
    })
  }

  // Add these new functions after the existing handler functions

  // Function to handle viewing doctor details
  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDoctorDetailsModal(true)
  }

  // Function to handle viewing patient details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowPatientDetailsModal(true)
  }

  // Function to handle viewing appointment details
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentDetailsModal(true)
  }

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="rating">
        <span className="rating-value">{rating}</span>
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
              ★
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Pending doctors for the sidebar widget
  const pendingDoctors = doctors.filter((doctor) => doctor.status === "pending")

  return (
    <div className="admin-dashboard-container">
      <AdminSideBar />
    
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage all aspects of your healthcare platform</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "doctors" ? "active" : ""}`}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors
          </button>
          <button
            className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            Patients
          </button>
          <button
            className={`tab-button ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="info-cards-grid">
                <div className="info-card">
                  <div className="info-card-content">
                    <div className="stat-icon-container">
                      <FiUsers size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Total Doctors</div>
                      <div className="stat-value">{stats.totalDoctors}</div>
                      <div className="stat-details">
                        <span>{stats.activeDoctors} active doctors</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-content">
                    <div className="stat-icon-container">
                      <FiUsers size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Total Patients</div>
                      <div className="stat-value">{stats.totalPatients}</div>
                      <div className="stat-details">
                        <span className="stat-growth positive">+4.6%</span>
                        <span>from last month</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-content">
                    <div className="stat-icon-container">
                      <FiCalendar size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Total Appointments</div>
                      <div className="stat-value">{stats.totalAppointments}</div>
                      <div className="stat-details">
                        <span className="stat-growth positive">+2.8%</span>
                        <span>from last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bookings-container">
                <div className="bookings-header">
                  <h3>Recent Appointments</h3>
                </div>
                <div className="bookings-table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <div className="patient-name">{appointment.patient}</div>
                          </td>
                          <td>{appointment.doctor}</td>
                          <td>
                            <div className="booking-date">{appointment.date}</div>
                            <div className="booking-time">
                              <FiClock size={14} />
                              <span>{appointment.time}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {appointment.status === "pending" && (
                                <>
                                  <button
                                    className="action-button confirm"
                                    onClick={() => handleAppointmentStatus(appointment.id, "confirmed")}
                                    title="Confirm"
                                  >
                                    <FiCheck size={18} />
                                  </button>
                                  <button
                                    className="action-button cancel"
                                    onClick={() => handleAppointmentStatus(appointment.id, "cancelled")}
                                    title="Cancel"
                                  >
                                    <FiX size={18} />
                                  </button>
                                </>
                              )}
                              <button
                                className="action-button view"
                                title="View Details"
                                onClick={() => handleViewAppointment(appointment)}
                              >
                                <FiEye size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bookings-footer">
                  <button className="view-all-button">View All Appointments</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="doctors-tab">
              <div className="tab-header">
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search doctors by name or specialty..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  />
                </div>
                <button className="add-button" onClick={() => setShowAddDoctorModal(true)}>
                  <FiPlus size={16} />
                  <span>Add Doctor</span>
                </button>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Patients</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>
                          <div className="doctor-cell">
                            <img src={doctor.img || "/placeholder.svg"} alt={doctor.name} className="doctor-avatar" />
                            <span>{doctor.name}</span>
                          </div>
                        </td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.patients}</td>
                        <td>
                          <StarRating rating={doctor.rating} />
                        </td>
                        <td>
                          <span className={`status-badge ${doctor.status}`}>
                            {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            
                            <button
                              className="action-button view"
                              title="View Profile"
                              onClick={() => handleViewDoctor(doctor)}
                            >
                              <FiEye size={18} />
                            </button>

                            {doctor.status === "active" && (
                              <button
                                className="action-button suspend"
                                title="Suspend"
                                onClick={() => handleDoctorStatus(doctor.id, "suspend")}
                              >
                                <FiAlertTriangle size={18} />
                              </button>
                            )}

                            {doctor.status === "suspended" && (
                              <button
                                className="action-button activate"
                                title="Activate"
                                onClick={() => handleDoctorStatus(doctor.id, "activate")}
                              >
                                <FiCheck size={18} />
                              </button>
                            )}

                            <button
                              className="action-button delete"
                              title="Delete"
                              onClick={() => handleDeleteDoctor(doctor.id)}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="patients-tab">
              <div className="tab-header">
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search patients by name or doctor..."
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Last Visit</th>
                      <th>Doctor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div className="doctor-cell">
                            <img src={patient.img || "/placeholder.svg"} alt={patient.name} className="doctor-avatar" />
                            <span>{patient.name}</span>
                          </div>
                        </td>
                        <td>{patient.age}</td>
                        <td>{patient.lastVisit}</td>
                        <td>{patient.doctor}</td>
                        <td>
                          <div className="action-buttons">
                            
                            <button
                              className="action-button view"
                              title="View Profile"
                              onClick={() => handleViewPatient(patient)}
                            >
                              <FiEye size={18} />
                            </button>
      
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="appointments-tab">
              <div className="appointments-stats">
                <div className="appointment-stat-card">
                  <h4>Today</h4>
                  <div className="stat-number">24</div>
                </div>
                <div className="appointment-stat-card">
                  <h4>This Week</h4>
                  <div className="stat-number">142</div>
                </div>
                <div className="appointment-stat-card">
                  <h4>This Month</h4>
                  <div className="stat-number">512</div>
                </div>
                <div className="appointment-stat-card">
                  <h4>Pending</h4>
                  <div className="stat-number">{appointments.filter((appt) => appt.status === "pending").length}</div>
                </div>
              </div>

              <div className="tab-header">
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <input type="text" className="search-input" placeholder="Search appointments..." />
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <div className="patient-name">{appointment.patient}</div>
                        </td>
                        <td>{appointment.doctor}</td>
                        <td>
                          <div className="booking-date">{appointment.date}</div>
                          <div className="booking-time">
                            <FiClock size={14} />
                            <span>{appointment.time}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${appointment.status}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {appointment.status === "pending" && (
                              <>
                                <button
                                  className="action-button confirm"
                                  onClick={() => handleAppointmentStatus(appointment.id, "confirmed")}
                                  title="Confirm"
                                >
                                  <FiCheck size={18} />
                                </button>
                                <button
                                  className="action-button cancel"
                                  onClick={() => handleAppointmentStatus(appointment.id, "cancelled")}
                                  title="Cancel"
                                >
                                  <FiX size={18} />
                                </button>
                              </>
                            )}
                            <button
                              className="action-button view"
                              title="View Details"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              <FiEye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="right-sidebar">
        <ProfileDropdown />
        <div className="sidebar-widget">
          <h3>Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <FiUsers size={16} />
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-label">Active Doctors</div>
                <div className="quick-stat-value">{doctors.filter((doc) => doc.status === "active").length}</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <FiUsers size={16} />
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-label">Total Patients</div>
                <div className="quick-stat-value">{stats.totalPatients}</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <FiCalendar size={16} />
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-label">Today's Appointments</div>
                <div className="quick-stat-value">24</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <FiStar size={16} />
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-label">Average Rating</div>
                <div className="quick-stat-value">4.7</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-widget">
          <h3>Pending Approvals</h3>
          <div className="pending-approvals">
            {pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <div className="pending-approval-item" key={doctor.id}>
                  <img src={doctor.img || "/placeholder.svg"} alt={doctor.name} className="pending-doctor-avatar" />
                  <div className="pending-doctor-info">
                    <div className="pending-doctor-name">{doctor.name}</div>
                    <div className="pending-doctor-specialty">{doctor.specialty}</div>
                  </div>
                  <div className="pending-approval-actions">
                    <button
                      className="micro-button approve"
                      title="Approve"
                      onClick={() => handleApprovePendingDoctor(doctor.id)}
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      className="micro-button reject"
                      title="Reject"
                      onClick={() => handleRejectPendingDoctor(doctor.id)}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-pending-items">No pending approvals</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Doctor</h3>
              <button className="close-modal" onClick={() => setShowAddDoctorModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="doctor-name">Doctor Name</label>
                <input
                  type="text"
                  id="doctor-name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="doctor-specialty">Specialty</label>
                <input
                  type="text"
                  id="doctor-specialty"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                  placeholder="Cardiology, Neurology, etc."
                />
              </div>
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setShowAddDoctorModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleAddDoctor}
                  disabled={!newDoctor.name || !newDoctor.specialty}
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button className="close-modal" onClick={() => setShowConfirmModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{actionMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (confirmAction === "delete") {
                    confirmDeleteDoctor()
                  } else if (confirmAction === "suspend" || confirmAction === "activate") {
                    confirmStatusChange()
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === "success" ? <FiCheck size={18} /> : <FiAlertTriangle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Doctor Details Modal */}
      {showDoctorDetailsModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowDoctorDetailsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Doctor Details</h3>
              <button className="close-modal" onClick={() => setShowDoctorDetailsModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="doctor-details-header">
                <img
                  src={selectedDoctor.img || "/placeholder.svg"}
                  alt={selectedDoctor.name}
                  className="doctor-details-avatar"
                />
                <div className="doctor-details-info">
                  <h2>{selectedDoctor.name}</h2>
                  <p className="doctor-details-specialty">{selectedDoctor.specialty}</p>
                  <span className={`status-badge ${selectedDoctor.status}`}>
                    {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="details-section">
                <h4>Professional Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Total Patients</span>
                    <span className="details-value">{selectedDoctor.patients}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Rating</span>
                    <span className="details-value">
                      {selectedDoctor.rating} <span className="star filled">★</span>
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Joined Date</span>
                    <span className="details-value">January 15, 2023</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Working Hours</span>
                    <span className="details-value">Mon-Fri, 9:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Contact Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Email</span>
                    <span className="details-value">
                      {selectedDoctor.name.toLowerCase().replace(" ", ".") + "@example.com"}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Phone</span>
                    <span className="details-value">+1 (555) 123-4567</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Address</span>
                    <span className="details-value">123 Medical Center Dr, Suite 456, New York, NY 10001</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Recent Appointments</h4>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter((appointment) => appointment.doctor === selectedDoctor.name)
                      .slice(0, 3)
                      .map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{appointment.patient}</td>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {appointments.filter((appointment) => appointment.doctor === selectedDoctor.name).length === 0 && (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No recent appointments
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDoctorDetailsModal(false)}>
                Close
              </button>
              <button className="btn-primary">Edit Doctor</button>
              {selectedDoctor.status === "active" ? (
                <button
                  className="btn-danger"
                  onClick={() => {
                    setShowDoctorDetailsModal(false)
                    handleDoctorStatus(selectedDoctor.id, "suspend")
                  }}
                >
                  Suspend Doctor
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowDoctorDetailsModal(false)
                    handleDoctorStatus(selectedDoctor.id, "activate")
                  }}
                >
                  Activate Doctor
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetailsModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowPatientDetailsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Details</h3>
              <button className="close-modal" onClick={() => setShowPatientDetailsModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="doctor-details-header">
                <img
                  src={selectedPatient.img || "/placeholder.svg"}
                  alt={selectedPatient.name}
                  className="doctor-details-avatar"
                />
                <div className="doctor-details-info">
                  <h2>{selectedPatient.name}</h2>
                  <p className="doctor-details-specialty">Patient ID: #{selectedPatient.id}</p>
                </div>
              </div>

              <div className="details-section">
                <h4>Personal Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Age</span>
                    <span className="details-value">{selectedPatient.age} years</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Gender</span>
                    <span className="details-value">{selectedPatient.age % 2 === 0 ? "Male" : "Female"}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Blood Type</span>
                    <span className="details-value">A{selectedPatient.id % 2 === 0 ? "+" : "-"}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Last Visit</span>
                    <span className="details-value">{selectedPatient.lastVisit}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Contact Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Email</span>
                    <span className="details-value">
                      {selectedPatient.name.toLowerCase().replace(" ", ".") + "@example.com"}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Phone</span>
                    <span className="details-value">
                      +1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Address</span>
                    <span className="details-value">
                      {Math.floor(Math.random() * 999) + 1} Main St, Apt {Math.floor(Math.random() * 99) + 1}, New York,
                      NY 10001
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Upcoming Appointments</h4>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter((appointment) => appointment.patient === selectedPatient.name)
                      .map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{appointment.doctor}</td>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {appointments.filter((appointment) => appointment.patient === selectedPatient.name).length ===
                      0 && (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No upcoming appointments
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPatientDetailsModal(false)}>
                Close
              </button>
              <button className="btn-primary">Edit Patient</button>
              <button className="btn-primary">Schedule Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentDetailsModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowAppointmentDetailsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button className="close-modal" onClick={() => setShowAppointmentDetailsModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="appointment-details-header">
                <div className="appointment-details-id">Appointment ID: #{selectedAppointment.id}</div>
                <span className={`status-badge ${selectedAppointment.status}`}>
                  {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </span>
              </div>

              <div className="details-section">
                <h4>Appointment Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Date</span>
                    <span className="details-value">{selectedAppointment.date}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Time</span>
                    <span className="details-value">{selectedAppointment.time}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Duration</span>
                    <span className="details-value">30 minutes</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Type</span>
                    <span className="details-value">
                      {["Consultation", "Follow-up", "Check-up", "Emergency"][selectedAppointment.id % 4]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Patient Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Name</span>
                    <span className="details-value">{selectedAppointment.patient}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Contact</span>
                    <span className="details-value">
                      +1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Email</span>
                    <span className="details-value">
                      {selectedAppointment.patient.toLowerCase().replace(" ", ".") + "@example.com"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Doctor Information</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Name</span>
                    <span className="details-value">{selectedAppointment.doctor}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Specialty</span>
                    <span className="details-value">
                      {doctors.find((doc) => doc.name === selectedAppointment.doctor)?.specialty || "General Medicine"}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Contact</span>
                    <span className="details-value">
                      +1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Notes</h4>
                <div className="appointment-notes">
                  {selectedAppointment.status === "pending" ? (
                    <p>No notes available yet. Appointment is pending.</p>
                  ) : selectedAppointment.status === "confirmed" ? (
                    <p>Appointment confirmed. Patient should arrive 15 minutes before the scheduled time.</p>
                  ) : selectedAppointment.status === "completed" ? (
                    <p>
                      Patient visited for{" "}
                      {
                        ["routine check-up", "follow-up consultation", "prescription renewal", "medical advice"][
                          selectedAppointment.id % 4
                        ]
                      }
                      . Doctor recommended{" "}
                      {
                        ["rest and hydration", "follow-up in 2 weeks", "new medication regimen", "lifestyle changes"][
                          selectedAppointment.id % 4
                        ]
                      }
                      .
                    </p>
                  ) : (
                    <p>Appointment was cancelled.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAppointmentDetailsModal(false)}>
                Close
              </button>
              {selectedAppointment.status === "pending" && (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      handleAppointmentStatus(selectedAppointment.id, "confirmed")
                      setShowAppointmentDetailsModal(false)
                    }}
                  >
                    Confirm Appointment
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      handleAppointmentStatus(selectedAppointment.id, "cancelled")
                      setShowAppointmentDetailsModal(false)
                    }}
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
              {selectedAppointment.status === "confirmed" && <button className="btn-primary">Reschedule</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

