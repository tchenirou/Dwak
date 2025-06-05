"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  List,
  X,
} from "lucide-react"
import "./AdminAppointments.css"
import Sidebar from "../../../../component/SideBar/AdminSideBar/AdminSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"

const AdminAppointments = () => {
  // State for appointments data
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // State for view mode
  const [viewMode, setViewMode] = useState("list") // "list" or "calendar"
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [appointmentsPerPage] = useState(10)

  // State for modals
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // State for appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    id: null,
    patient: "",
    doctor: "",
    date: "",
    time: "",
    type: "",
    status: "",
    notes: "",
  })

  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  // Sample data for appointments
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleAppointments = [
        {
          id: 1,
          patient: {
            id: 101,
            name: "Ahmed Bouaziz",
            email: "ahmed.b@example.com",
            phone: "+213 555 123 456",
          },
          doctor: {
            id: 201,
            name: "Dr. Amina Meziane",
            specialty: "Cardiologie",
          },
          date: "2025-03-15",
          time: "09:30",
          duration: "30 min",
          type: "Consultation initiale",
          status: "confirmed",
          notes: "Premier rendez-vous pour évaluation cardiaque",
          paymentStatus: "paid",
          amount: 2500,
        },
        {
          id: 2,
          patient: {
            id: 102,
            name: "Fatima Zahra",
            email: "fatima.z@example.com",
            phone: "+213 555 234 567",
          },
          doctor: {
            id: 202,
            name: "Dr. Karim Benali",
            specialty: "Neurologie",
          },
          date: "2025-03-15",
          time: "11:00",
          duration: "45 min",
          type: "Suivi",
          status: "confirmed",
          notes: "Suivi post-traitement",
          paymentStatus: "pending",
          amount: 3000,
        },
        {
          id: 3,
          patient: {
            id: 103,
            name: "Mohammed Larbi",
            email: "mohammed.l@example.com",
            phone: "+213 555 345 678",
          },
          doctor: {
            id: 203,
            name: "Dr. Leila Hadj",
            specialty: "Pédiatrie",
          },
          date: "2025-03-16",
          time: "10:15",
          duration: "30 min",
          type: "Consultation initiale",
          status: "pending",
          notes: "Consultation pour fièvre persistante",
          paymentStatus: "not_paid",
          amount: 2000,
        },
        {
          id: 4,
          patient: {
            id: 104,
            name: "Nour El Houda",
            email: "nour.e@example.com",
            phone: "+213 555 456 789",
          },
          doctor: {
            id: 201,
            name: "Dr. Amina Meziane",
            specialty: "Cardiologie",
          },
          date: "2025-03-16",
          time: "14:30",
          duration: "30 min",
          type: "Suivi",
          status: "confirmed",
          notes: "Suivi de tension artérielle",
          paymentStatus: "paid",
          amount: 2500,
        },
        {
          id: 5,
          patient: {
            id: 105,
            name: "Youcef Amir",
            email: "youcef.a@example.com",
            phone: "+213 555 567 890",
          },
          doctor: {
            id: 204,
            name: "Dr. Omar Taleb",
            specialty: "Dermatologie",
          },
          date: "2025-03-17",
          time: "09:00",
          duration: "30 min",
          type: "Consultation initiale",
          status: "cancelled",
          notes: "Annulé par le patient",
          paymentStatus: "refunded",
          amount: 2200,
        },
        {
          id: 6,
          patient: {
            id: 106,
            name: "Amina Kaci",
            email: "amina.k@example.com",
            phone: "+213 555 678 901",
          },
          doctor: {
            id: 205,
            name: "Dr. Yasmine Khelifi",
            specialty: "Psychiatrie",
          },
          date: "2025-03-17",
          time: "11:30",
          duration: "60 min",
          type: "Thérapie",
          status: "completed",
          notes: "Séance de thérapie cognitive",
          paymentStatus: "paid",
          amount: 4000,
        },
        {
          id: 7,
          patient: {
            id: 107,
            name: "Karim Hadj",
            email: "karim.h@example.com",
            phone: "+213 555 789 012",
          },
          doctor: {
            id: 202,
            name: "Dr. Karim Benali",
            specialty: "Neurologie",
          },
          date: "2025-03-18",
          time: "13:45",
          duration: "45 min",
          type: "Suivi",
          status: "confirmed",
          notes: "Suivi de traitement pour migraines",
          paymentStatus: "paid",
          amount: 3000,
        },
        {
          id: 8,
          patient: {
            id: 108,
            name: "Lina Mansouri",
            email: "lina.m@example.com",
            phone: "+213 555 890 123",
          },
          doctor: {
            id: 203,
            name: "Dr. Leila Hadj",
            specialty: "Pédiatrie",
          },
          date: "2025-03-18",
          time: "15:00",
          duration: "30 min",
          type: "Vaccination",
          status: "confirmed",
          notes: "Vaccination programmée",
          paymentStatus: "pending",
          amount: 1500,
        },
        {
          id: 9,
          patient: {
            id: 109,
            name: "Samir Bouzid",
            email: "samir.b@example.com",
            phone: "+213 555 901 234",
          },
          doctor: {
            id: 204,
            name: "Dr. Omar Taleb",
            specialty: "Dermatologie",
          },
          date: "2025-03-19",
          time: "10:00",
          duration: "30 min",
          type: "Consultation initiale",
          status: "pending",
          notes: "Consultation pour problème de peau",
          paymentStatus: "not_paid",
          amount: 2200,
        },
        {
          id: 10,
          patient: {
            id: 110,
            name: "Yasmine Cherif",
            email: "yasmine.c@example.com",
            phone: "+213 555 012 345",
          },
          doctor: {
            id: 205,
            name: "Dr. Yasmine Khelifi",
            specialty: "Psychiatrie",
          },
          date: "2025-03-19",
          time: "16:30",
          duration: "60 min",
          type: "Thérapie",
          status: "confirmed",
          notes: "Séance de suivi thérapeutique",
          paymentStatus: "paid",
          amount: 4000,
        },
      ]

      setAppointments(sampleAppointments)
      setFilteredAppointments(sampleAppointments)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter appointments
  useEffect(() => {
    let result = [...appointments]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (appointment) =>
          appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((appointment) => appointment.status === statusFilter)
    }

    // Apply doctor filter
    if (doctorFilter !== "all") {
      result = result.filter((appointment) => appointment.doctor.id === Number.parseInt(doctorFilter))
    }

    // Apply date filter
    if (dateFilter) {
      result = result.filter((appointment) => appointment.date === dateFilter)
    }

    // Apply selected date filter (for calendar view)
    if (selectedDate) {
      const formattedSelectedDate = formatDateForFilter(selectedDate)
      result = result.filter((appointment) => appointment.date === formattedSelectedDate)
    }

    setFilteredAppointments(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [appointments, searchQuery, statusFilter, doctorFilter, dateFilter, selectedDate])

  // Get current appointments for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment)
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format date for filter
  const formatDateForFilter = (date) => {
    return date.toISOString().split("T")[0]
  }

  // Get unique doctors for filter
  const uniqueDoctors = [...new Map(appointments.map((item) => [item.doctor.id, item.doctor])).values()]

  // Get appointment statistics
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    todayCount: appointments.filter((a) => a.date === formatDateForFilter(new Date())).length,
  }

  // Handle appointment status change
  const handleStatusChange = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
    )

    setAppointments(updatedAppointments)

    // If the appointment is currently selected, update it
    if (selectedAppointment && selectedAppointment.id === appointmentId) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus })
    }

    // Show success alert
    setAlert({
      show: true,
      message: `Le statut du rendez-vous a été mis à jour avec succès !`,
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Open view modal
  const openViewModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowViewModal(true)
  }

  // Open edit modal
  const openEditModal = (appointment) => {
    setAppointmentForm({
      id: appointment.id,
      patient: appointment.patient.name,
      doctor: appointment.doctor.name,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    })
    setSelectedAppointment(appointment)
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDeleteModal(true)
  }

  // Handle delete appointment
  const handleDeleteAppointment = () => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== selectedAppointment.id)

    setAppointments(updatedAppointments)
    setShowDeleteModal(false)

    // Show success alert
    setAlert({
      show: true,
      message: `Le rendez-vous a été supprimé avec succès !`,
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setAppointmentForm({
      ...appointmentForm,
      [name]: value,
    })
  }

  // Handle edit appointment
  const handleEditAppointment = (e) => {
    e.preventDefault()

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentForm.id) {
        return {
          ...appointment,
          date: appointmentForm.date,
          time: appointmentForm.time,
          type: appointmentForm.type,
          status: appointmentForm.status,
          notes: appointmentForm.notes,
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    setShowEditModal(false)

    // Show success alert
    setAlert({
      show: true,
      message: `Le rendez-vous a été mis à jour avec succès !`,
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Start date will be the first day minus the days from previous month
    const startDate = new Date(year, month, 1 - daysFromPrevMonth)

    // We'll show 6 weeks (42 days) to ensure we have enough days
    const days = []

    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)

      // Check if the day is from the current month
      const isCurrentMonth = currentDay.getMonth() === month

      // Check if the day is today
      const isToday = currentDay.toDateString() === new Date().toDateString()

      // Check if the day is selected
      const isSelected = selectedDate && currentDay.toDateString() === selectedDate.toDateString()

      // Format the date for filtering
      const formattedDate = formatDateForFilter(currentDay)

      // Get appointments for this day
      const dayAppointments = appointments.filter((a) => a.date === formattedDate)

      days.push({
        date: currentDay,
        isCurrentMonth,
        isToday,
        isSelected,
        appointments: dayAppointments,
      })
    }

    return days
  }

  // Handle calendar day click
  const handleDayClick = (day) => {
    setSelectedDate(day.date)
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Export appointments
  const exportAppointments = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exportation des rendez-vous...")
  }

  return (
    <div className="admin-appointments-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <ProfileDropdown />
        <div className="page-header">
          <div>
            <h1>Gestion des Rendez-vous</h1>
            <p>Gérez et suivez tous les rendez-vous de la plateforme</p>
          </div>
          <div className="header-actions">
            <button className="export-button" onClick={exportAppointments}>
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total des rendez-vous</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon confirmed-icon">
              <CheckCircle />
            </div>
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">Confirmés</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending-icon">
              <Clock />
            </div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">En attente</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cancelled-icon">
              <XCircle />
            </div>
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Annulés</div>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="view-toggle-container">
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
              Liste
            </button>
            <button
              className={`view-button ${viewMode === "calendar" ? "active" : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar size={16} />
              Calendrier
            </button>
          </div>

          <div className="filters-container">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un patient, médecin ou type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters">
              <div className="filter-group">
                <label>Statut:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Médecin:</label>
                <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
                  <option value="all">Tous les médecins</option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date:</label>
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>

              <button
                className="filter-button"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setDoctorFilter("all")
                  setDateFilter("")
                  setSelectedDate(null)
                }}
              >
                <Filter size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="calendar-container">
            <div className="calendar-header">
              <div className="calendar-title">
                {currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </div>
              <div className="calendar-nav">
                <button className="calendar-nav-button" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </button>
                <button className="calendar-nav-button" onClick={goToToday}>
                  Aujourd'hui
                </button>
                <button className="calendar-nav-button" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              {/* Weekday headers */}
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
                <div key={index} className="calendar-weekday">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""} ${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="day-number">{day.date.getDate()}</div>
                  <div className="day-appointments">
                    {day.appointments.slice(0, 3).map((appointment, i) => (
                      <div
                        key={i}
                        className={`day-appointment appointment-${appointment.status}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          openViewModal(appointment)
                        }}
                      >
                        {appointment.time} - {appointment.patient.name.split(" ")[0]}
                      </div>
                    ))}
                    {day.appointments.length > 3 && (
                      <div className="more-appointments">+{day.appointments.length - 3} plus</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="list-container">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement des rendez-vous...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <p>Aucun rendez-vous trouvé correspondant à vos critères.</p>
                <button
                  className="reset-button"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setDoctorFilter("all")
                    setDateFilter("")
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Médecin</th>
                      <th>Date & Heure</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Paiement</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>#{appointment.id}</td>
                        <td>
                          <div className="patient-info">
                            <div className="patient-name">{appointment.patient.name}</div>
                            <div className="patient-email">{appointment.patient.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="doctor-info">
                            <div className="doctor-name">{appointment.doctor.name}</div>
                            <div className="doctor-specialty">{appointment.doctor.specialty}</div>
                          </div>
                        </td>
                        <td>
                          <div className="appointment-date-time">
                            <div className="appointment-date">{formatDate(appointment.date)}</div>
                            <div className="appointment-time">
                              {appointment.time} ({appointment.duration})
                            </div>
                          </div>
                        </td>
                        <td>{appointment.type}</td>
                        <td>
                          <span className={`status-badge ${appointment.status}`}>
                            {appointment.status === "confirmed" && "Confirmé"}
                            {appointment.status === "pending" && "En attente"}
                            {appointment.status === "completed" && "Terminé"}
                            {appointment.status === "cancelled" && "Annulé"}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-badge ${appointment.paymentStatus}`}>
                            {appointment.paymentStatus === "paid" && "Payé"}
                            {appointment.paymentStatus === "pending" && "En attente"}
                            {appointment.paymentStatus === "not_paid" && "Non payé"}
                            {appointment.paymentStatus === "refunded" && "Remboursé"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button view"
                              title="Voir les détails"
                              onClick={() => openViewModal(appointment)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="action-button edit"
                              title="Modifier le rendez-vous"
                              onClick={() => openEditModal(appointment)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="action-button delete"
                              title="Supprimer le rendez-vous"
                              onClick={() => openDeleteModal(appointment)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <div className="pagination-info">
                      Affichage de {indexOfFirstAppointment + 1} à{" "}
                      {Math.min(indexOfLastAppointment, filteredAppointments.length)} sur {filteredAppointments.length}
                    </div>
                    <div className="pagination-controls">
                      <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`pagination-page ${currentPage === index + 1 ? "active" : ""}`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal appointment-detail-modal">
            <div className="modal-header">
              <h3>Détails du Rendez-vous</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4 className="detail-section-title">Informations générales</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID du rendez-vous:</span>
                    <span className="detail-value">#{selectedAppointment.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{selectedAppointment.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Heure:</span>
                    <span className="detail-value">{selectedAppointment.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durée:</span>
                    <span className="detail-value">{selectedAppointment.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Statut:</span>
                    <span className={`status-badge ${selectedAppointment.status}`}>
                      {selectedAppointment.status === "confirmed" && "Confirmé"}
                      {selectedAppointment.status === "pending" && "En attente"}
                      {selectedAppointment.status === "completed" && "Terminé"}
                      {selectedAppointment.status === "cancelled" && "Annulé"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Patient</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nom:</span>
                    <span className="detail-value">{selectedAppointment.patient.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedAppointment.patient.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Téléphone:</span>
                    <span className="detail-value">{selectedAppointment.patient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Médecin</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nom:</span>
                    <span className="detail-value">{selectedAppointment.doctor.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Spécialité:</span>
                    <span className="detail-value">{selectedAppointment.doctor.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Paiement</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Montant:</span>
                    <span className="detail-value">{selectedAppointment.amount} DZD</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Statut:</span>
                    <span className={`payment-badge ${selectedAppointment.paymentStatus}`}>
                      {selectedAppointment.paymentStatus === "paid" && "Payé"}
                      {selectedAppointment.paymentStatus === "pending" && "En attente"}
                      {selectedAppointment.paymentStatus === "not_paid" && "Non payé"}
                      {selectedAppointment.paymentStatus === "refunded" && "Remboursé"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Notes</h4>
                <div className="appointment-notes">{selectedAppointment.notes || "Aucune note disponible."}</div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedAppointment.status === "pending" && (
                <>
                  <button
                    className="detail-button confirm-button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "confirmed")
                      setShowViewModal(false)
                    }}
                  >
                    <CheckCircle size={16} />
                    Confirmer
                  </button>
                  <button
                    className="detail-button cancel-button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "cancelled")
                      setShowViewModal(false)
                    }}
                  >
                    <XCircle size={16} />
                    Annuler
                  </button>
                </>
              )}
              {selectedAppointment.status === "confirmed" && (
                <>
                  <button
                    className="detail-button complete-button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "completed")
                      setShowViewModal(false)
                    }}
                  >
                    <CheckCircle size={16} />
                    Marquer comme terminé
                  </button>
                  <button
                    className="detail-button cancel-button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "cancelled")
                      setShowViewModal(false)
                    }}
                  >
                    <XCircle size={16} />
                    Annuler
                  </button>
                </>
              )}
              <button
                className="detail-button edit-button"
                onClick={() => {
                  setShowViewModal(false)
                  openEditModal(selectedAppointment)
                }}
              >
                <Edit size={16} />
                Modifier
              </button>
              <button className="detail-button close-button" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Modifier le Rendez-vous</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditAppointment}>
                <div className="form-group">
                  <label htmlFor="patient">Patient</label>
                  <input type="text" id="patient" name="patient" value={appointmentForm.patient} disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="doctor">Médecin</label>
                  <input type="text" id="doctor" name="doctor" value={appointmentForm.doctor} disabled />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={appointmentForm.date}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Heure</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={appointmentForm.time}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select id="type" name="type" value={appointmentForm.type} onChange={handleFormChange} required>
                    <option value="Consultation initiale">Consultation initiale</option>
                    <option value="Suivi">Suivi</option>
                    <option value="Thérapie">Thérapie</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Urgence">Urgence</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Statut</label>
                  <select id="status" name="status" value={appointmentForm.status} onChange={handleFormChange} required>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={appointmentForm.notes}
                    onChange={handleFormChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action ne peut pas être annulée.</p>
              <div className="appointment-summary">
                <p>
                  <strong>Patient:</strong> {selectedAppointment.patient.name}
                </p>
                <p>
                  <strong>Médecin:</strong> {selectedAppointment.doctor.name}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedAppointment.date)} à {selectedAppointment.time}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn-danger" onClick={handleDeleteAppointment}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert/Notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}
    </div>
  )
}

export default AdminAppointments

