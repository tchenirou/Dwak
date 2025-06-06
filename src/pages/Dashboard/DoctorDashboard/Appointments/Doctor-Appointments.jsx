"use client"

import { useState, useMemo,useEffect,useRef } from "react"
import {
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  X,
} from "lucide-react"
import "./Doctor-Appointments.css"
import Sidebar from "../../../../component/SideBar/DoctorSideBar/DoctorSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"
import {  } from "react";
import { useNavigate } from "react-router-dom";



const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [appointments, setAppointments] = useState({
    upcoming: [
      {
        id: 1,
        patient: "Amina Bensalem",
        date: "2025-03-01",
        time: "10:30 AM",
        type: "Follow-up",
        status: "Confirmed",
        duration: "30 min",
        notes: "Post-surgery check",
      },
      {
        id: 2,
        patient: "Issam Haddad",
        date: "2025-03-01",
        time: "2:00 PM",
        type: "Initial Consultation",
        status: "Confirmed",
        duration: "45 min",
        notes: "New patient referral",
      },
      {
        id: 3,
        patient: "Nadia Cherif",
        date: "2025-03-02",
        time: "9:15 AM",
        type: "Check-up",
        status: "Pending",
        duration: "30 min",
        notes: "Routine check-up",
      },
      {
        id: 4,
        patient: "Mehdi Belkacem",
        date: "2025-03-02",
        time: "11:45 AM",
        type: "Follow-up",
        status: "Confirmed",
        duration: "30 min",
        notes: "Medication review",
      },
      {
        id: 5,
        patient: "Sofia Mansouri",
        date: "2025-03-03",
        time: "3:30 PM",
        type: "Initial Consultation",
        status: "Confirmed",
        duration: "45 min",
        notes: "First appointment",
      },
    ],
    history: [
      {
        id: 6,
        patient: "Karim Bouzid",
        date: "2025-02-28",
        time: "11:00 AM",
        type: "Follow-up",
        status: "Completed",
        duration: "30 min",
        notes: "Contrôle de la tension artérielle",
      },
      {
        id: 7,
        patient: "Lina Gherbi",
        date: "2025-02-27",
        time: "9:30 AM",
        type: "Check-up",
        status: "Completed",
        duration: "30 min",
        notes: "Bilan annuel de santé",
      },
      {
        id: 8,
        patient: "Samir Khelifi",
        date: "2025-02-26",
        time: "2:15 PM",
        type: "Follow-up",
        status: "Completed",
        duration: "30 min",
        notes: "Évaluation post-traitement",
      },
      {
        id: 9,
        patient: "Yasmine Merah",
        date: "2025-02-25",
        time: "4:00 AM",
        type: "Initial Consultation",
        status: "Completed",
        duration: "45 min",
        notes: "Première consultation",
      },
      {
        id: 10,
        patient: "Hakim Benali",
        date: "2025-02-24",
        time: "10:45 AM",
        type: "Follow-up",
        status: "No Show",
        duration: "30 min",
        notes: "Absent au rendez-vous",
      },
    ],
  })
  
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRefs = useRef({});

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen !== null &&
        dropdownRefs.current[dropdownOpen] &&
        !dropdownRefs.current[dropdownOpen].contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);



  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredAppointments = useMemo(() => {
    const currentAppointments = appointments[activeTab]
    return currentAppointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.notes.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || appointment.type === filterType
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
  }, [activeTab, searchQuery, filterType, filterStatus, appointments])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterType = (type) => {
    setFilterType(type)
  }

  const handleFilterStatus = (status) => {
    setFilterStatus(status)
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments((prevAppointments) => ({
      ...prevAppointments,
      [activeTab]: prevAppointments[activeTab].map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
      ),
    }))
  }

  const openModal = (appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedAppointment(null)
    setIsModalOpen(false)
  }

  return (
    <div className="doctor-appointments-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Appointments</h1>
            <p>Manage your upcoming appointments and view history</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Search appointments..." value={searchQuery} onChange={handleSearch} />
            </div>
            <div className="filter">
              <select className="filter-dropdowns" onChange={(e) => handleFilterType(e.target.value)} value={filterType}>
                <option value="all">All Types</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Initial Consultation">Initial Consultation</option>
                <option value="Check-up">Check-up</option>
              </select>
              <select className="filter-dropdowns" onChange={(e) => handleFilterStatus(e.target.value)} value={filterStatus}>
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="appointments-tabs">
          <button
            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {/* Appointments Container */}
        <div className="appointments-container">
          {filteredAppointments.length === 0 && (
            <div className="no-appointments">
              <p>No appointments found matching your search or filters.</p>
            </div>
          )}
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <div className="appointment-time">
                    <span className="time">{appointment.time}</span>
                    <span className="duration">{appointment.duration}</span>
                  </div>
                  <div className="appointment-details">
                    <h4 className="patient-name">{appointment.patient}</h4>
                    <p className="appointment-type">{appointment.type}</p>
                    <div className="appointment-meta">
                      <span className="date">{appointment.date}</span>
                      <span className={`status-badge ${appointment.status.toLowerCase().replace(" ", "-")}`}>
                        {appointment.status}
                      </span>
                    </div>
                    {appointment.notes && <p className="appointment-notes">{appointment.notes}</p>}
                  </div>
                </div>
                <div className="appointment-actions">
                  {activeTab === "upcoming" &&
                    (appointment.status === "Pending" ? (
                      <>
                        <button
                          className="action-button confirm"
                          onClick={() => handleStatusChange(appointment.id, "Confirmed")}
                        >
                          <CheckCircle size={18} />
                          <span>Confirm</span>
                        </button>
                        <button
                          className="action-button cancel"
                          onClick={() => handleStatusChange(appointment.id, "Cancelled")}
                        >
                          <XCircle size={18} />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <div className="dropdown" ref={(el) => (dropdownRefs.current[appointment.id] = el)}>
                  <button className="dropdown-button" onClick={() => toggleDropdown(appointment.id)}>
                    <MoreHorizontal size={18} color="black" />
                  </button>
                  {dropdownOpen === appointment.id && (
                    <div className="dropdown-content">
                      <button onClick={() => handleStatusChange(appointment.id, "Cancelled")}>Cancel Appointment</button>
                      <button onClick={() => openModal(appointment)}>View Patient Details</button>
                    </div>
  )}
</div>                      
                    ))}
                  {activeTab === "history" && (
                    <button className="action-button view" onClick={() => openModal(appointment)}>
                      <span>View Details</span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <ProfileDropdown />
        <div className="sidebar-widget">
          <h3>Today's Schedule</h3>
          <div className="schedule-timeline">
            <div className="timeline-item">
              <div className="timeline-time">9:00 AM</div>
              <div className="timeline-content">
                <div className="timeline-patient">David Miller</div>
                <div className="timeline-type">Initial Consultation</div>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="timeline-time">10:30 AM</div>
              <div className="timeline-content">
                <div className="timeline-patient">Sarah Johnson</div>
                <div className="timeline-type">Follow-up</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">11:45 AM</div>
              <div className="timeline-content">
                <div className="timeline-patient">Break</div>
                <div className="timeline-type">30 minutes</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">2:00 PM</div>
              <div className="timeline-content">
                <div className="timeline-patient">Michael Chen</div>
                <div className="timeline-type">Initial Consultation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              <X size={24} color="blue" />
            </button>
            <h2>Appointment Details</h2>
            <div className="modal-body">
              <p>
                <strong>Patient:</strong> {selectedAppointment.patient}
              </p>
              <p>
                <strong>Date:</strong> {selectedAppointment.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedAppointment.time}
              </p>
              <p>
                <strong>Type:</strong> {selectedAppointment.type}
              </p>
              <p>
                <strong>Status:</strong> {selectedAppointment.status}
              </p>
              <p>
                <strong>Duration:</strong> {selectedAppointment.duration}
              </p>
              <p>
                <strong>Notes:</strong> {selectedAppointment.notes}
              </p>
              {/* Add more details as needed */}
              <div className="patient-info">
                <h3>Patient Information</h3>
                <p>
                  <strong>Age:</strong> 35
                </p>
                <p>
                  <strong>Gender:</strong> Female
                </p>
                <p>
                  <strong>Contact:</strong> +213 555 123 456
                </p>
                <p>
                  <strong>Email:</strong> patient@example.com
                </p>
                <p>
                  <strong>Medical History:</strong> Hypertension, Allergies (Penicillin)
                </p>
              </div>
              {activeTab === "upcoming" && (
                <div className="modal-actions">
                  <button
  className="action-button confirm"
  onClick={() => {
    handleStatusChange(selectedAppointment.id, "Confirmed");
    navigate(`/consultation/1`);
  }}
>
  Confirm Appointment
</button>

                  <button
                    className="action-button cancel"
                    onClick={() => handleStatusChange(selectedAppointment.id, "Cancelled")}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments

