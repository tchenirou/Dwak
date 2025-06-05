"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Video, MessageCircle, CreditCard, X} from 'lucide-react'
import { format, isToday, isTomorrow, isPast, differenceInMinutes } from "date-fns"
import { fr } from "date-fns/locale"
import "./PatientAppointement.css"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown";
import Sidebar from "../../../../component/SideBar/PatientSideBar/SideBar"
import { useNavigate } from "react-router-dom";



// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    doctorName: "Dr. Sarah Benali",
    doctorImage: "/Images/Dfemme2.png",
    specialty: "Médecin Généraliste",
    date: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    duration: 30,
    price: 65,
    isPaid: false,
    status: "upcoming",
    type: "video",
    roomId: "1"
  },
  {
    id: 2,
    doctorName: "Dr. Ahmed Kader",
    doctorImage: "/Images/Dhomme2.png",
    specialty: "Cardiologue",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    duration: 45,
    price: 80,
    isPaid: true,
    status: "confirmed",
    type: "video",
    roomId: "w"
  },
  {
    id: 3,
    doctorName: "Dr. Leila Mansouri",
    doctorImage: "/Images/image3.png",
    specialty: "Pédiatre",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    duration: 30,
    price: 65,
    isPaid: true,
    status: "completed",
    type: "chat",
    roomId: "3"
  },
]

export default function MyAppointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming")
  const [appointments, setAppointments] = useState(mockAppointments)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [countdown, setCountdown] = useState("")

  // Update countdown timer for the next upcoming appointment
  useEffect(() => {
    const timer = setInterval(() => {
      const upcomingAppointment = appointments.find(
        (apt) => !isPast(apt.date) && apt.status === "upcoming"
      )
      
      if (upcomingAppointment) {
        const diff = differenceInMinutes(upcomingAppointment.date, new Date())
        const hours = Math.floor(diff / 60)
        const minutes = diff % 60
        setCountdown(`${hours}h ${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [appointments])

  // Handle payment for an appointment
  const handlePayment = async (appointmentId) => {
    // Implement payment logic here
    console.log("Processing payment for appointment:", appointmentId)
  }

  // Handle appointment cancellation
  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment)
    setShowCancelModal(true)
  }

  // Confirm appointment cancellation
  const confirmCancel = () => {
    if (selectedAppointment) {
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: "cancelled" }
          : apt
      ))
      setShowCancelModal(false)
    }
  }

  // Handle joining a video call for an appointment
  const handleJoinCall = (appointment) => {
  if (!appointment.roomId) {
    console.error("No roomId found for this appointment");
    return;
  }

  navigate(`/consultation/${appointment.roomId}`);
}


  // Get status badge for an appointment
  const getStatusBadge = (appointment) => {
    const statusConfig = {
      upcoming: { color: "bg-blue-100 text-blue-800", text: "À venir" },
      confirmed: { color: "bg-green-100 text-green-800", text: "Confirmé" },
      completed: { color: "bg-gray-100 text-gray-800", text: "Terminé" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Annulé" },
    }

    const status = statusConfig[appointment.status]
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
    )
  }

  // Format appointment date
  const formatAppointmentDate = (date) => {
    if (isToday(date)) {
      return `Aujourd'hui à ${format(date, "HH:mm")}`
    } else if (isTomorrow(date)) {
      return `Demain à ${format(date, "HH:mm")}`
    }
    return format(date, "d MMMM à HH:mm", { locale: fr })
  }

  return (
    <div className="my-appointments-page">
      
      <Sidebar/>
      <ProfileDropdown />
      <div className="appointments-container">
        <div className="appointments-card">
          <h1 className="page-title">Mes Rendez-vous</h1>
          
          {/* Tabs */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`tab ${activeTab === "past" ? "active" : ""}`}
            >
              Historique
            </button>
          </div>

          {/* Appointments List */}
          <div className="appointment-list">
            {appointments
              .filter(apt => 
                activeTab === "upcoming" 
                  ? !isPast(apt.date) || apt.status === "upcoming"
                  : isPast(apt.date) && apt.status !== "upcoming"
              )
              .map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="doctor-info">
                      <img
                        src={appointment.doctorImage || "/placeholder.svg"}
                        alt={appointment.doctorName}
                        className="doctor-image"
                      />
                      <div>
                        <h3 className="doctor-name">{appointment.doctorName}</h3>
                        <p className="doctor-specialty">{appointment.specialty}</p>
                      </div>
                    </div>
                    <span className={`appointment-status status-${appointment.status}`}>
                      {getStatusBadge(appointment)}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="detail-item">
                      <Calendar className="w-4 h-4" />
                      {formatAppointmentDate(appointment.date)}
                    </div>
                    <div className="detail-item">
                      <Clock className="w-4 h-4" />
                      {appointment.duration} minutes
                    </div>
                    <div className="detail-item">
                      {appointment.type === "video" ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                      {appointment.type === "video" ? "Consultation vidéo" : "Chat"}
                    </div>
                  </div>

                  {/* Actions */}
                  {appointment.status === "upcoming" && (
                    <div className="appointment-actions">
                      <div className="pay-cancel-buttons">
                        {!appointment.isPaid && (
                          <button
                            onClick={() => handlePayment(appointment.id)}
                            className="action-button pay-button"
                          >
                            <CreditCard className="w-4 h-4" />
                            Payer {appointment.price}€
                          </button>
                        )}
                        <button
                          onClick={() => handleCancel(appointment)}
                          className="action-button cancel-button"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                      
                      {differenceInMinutes(appointment.date, new Date()) <= 30 && (
                        <button
  onClick={() => handleJoinCall(appointment)}
  className="action-button join-button"
>
  {appointment.type === "video" ? (
    <Video className="w-4 h-4" />
  ) : (
    <MessageCircle className="w-4 h-4" />
  )}
  Rejoindre
</button>

                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Next Appointment Card */}
        {appointments.some(apt => apt.status === "upcoming") && (
          <div className="next-appointment-card">
            <h2 className="next-appointment-title">Prochain rendez-vous</h2>
            <div className="countdown">
              <div>
                <p className="countdown-time">{countdown}</p>
                <p className="countdown-label">Temps restant</p>
              </div>
              <button
                onClick={() => handleJoinCall(appointments[0].id)}
                className="prepare-button"
              >
                {appointments[0].type === "video" ? (
                  <Video className="w-4 h-4" viewBox="0 -4 24 24" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                Préparer la consultation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirmer l'annulation</h3>
            <p className="modal-message">
              Êtes-vous sûr de vouloir annuler votre rendez-vous avec {selectedAppointment.doctorName} ?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelModal(false)}
                className="modal-button modal-cancel"
              >
                Retour
              </button>
              <button
                onClick={confirmCancel}
                className="modal-button modal-confirm"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
