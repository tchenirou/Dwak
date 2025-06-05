"use client"

import { useState, useEffect } from "react"
import {FaStar,FaSearch,FaCalendarAlt,FaMapMarkerAlt,FaPhone,} from 'react-icons/fa';
import "./FindDoctor.css"
import { Home, Calendar, FileText, User, Gift, Search, ChevronRight, Clock, PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown";
import Sidebar from "../../../../component/SideBar/PatientSideBar/SideBar"

const specialties = [
  "Médecine générale", "Pédiatrie", "Cardiologie", "Dermatologie", "Gynécologie",
  "Ophtalmologie", "Orthopédie", "Psychiatrie", "Neurologie", "Endocrinologie"
]

const mockDoctors = [
  { 
    id: 1, 
    name: "Dr. Sarah Benali", 
    specialty: "Gynécologie", 
    rating: 4.8, 
    reviews: 124, 
    image: "/Images/Dfemme2.png",
    experience: "12 ans",
    availability: ['9:00', '11:00', '14:00', '16:00'],
    bio: "Dr. Benali est spécialisée dans la santé reproductive des femmes.",
    address: "Rue Didouche Mourad, Alger-Centre, Alger 16000, Algérie",
    phone: "+213 671 98 34 54"
  },
  { 
    id: 2, 
    name: "Dr. Ahmed Kader", 
    specialty: "Cardiologie", 
    rating: 4.9, 
    reviews: 98, 
    image: "/Images/Dhomme1.png",
    experience: "15 ans",
    availability: ['10:00', '13:00', '15:00', '17:00'],
    bio: "Dr. Kader est expert en maladies cardiovasculaires.",
    address: "45 Boulevard Zighout Youcef, Bab El Oued, Alger 16090, Algérie",
    phone: "+213 540 98 76 54"
  },
  { 
    id: 3, 
    name: "Dr. Leila Mansouri", 
    specialty: "Pédiatrie", 
    rating: 4.7, 
    reviews: 156, 
    image: "/Images/Dfemme1.jpg",
    experience: "10 ans",
    availability: ['8:00', '10:00', '12:00', '15:00'],
    bio: "Dr. Mansouri offre des soins attentionnés aux enfants de tout âge.",
    address: "Rue Abane Ramdane, Béjaïa 06000, Algérie",
    phone: "+213 699 12 34 56"
  },
  { 
    id: 4, 
    name: "Dr. Karim Zidane", 
    specialty: "Dermatologie", 
    rating: 3, 
    reviews: 89, 
    image: "/Images/Dhomme2.png",
    experience: "8 ans",
    availability: ['9:00', '12:00', '14:30', '16:30'],
    bio: "Dr. Zidane est spécialisé dans le traitement des affections cutanées.",
    address: "Avenue de l'ALN, Oran 31000, Algérie",
    phone: "+213 770 34 56 78"
  },
  { 
    id: 5, 
    name: "Dr. Amine Tazi", 
    specialty: "Médecine générale", 
    rating: 4.9, 
    reviews: 201, 
    image: "/Images/Dhomme3.png",
    experience: "20 ans",
    availability: ['8:30', '11:30', '14:00', '16:00'],
    bio: "Dr. Tazi propose une approche holistique des soins de santé.",
    address: "Lotissement Bouchaoui, Cheraga, Alger 16002, Algérie",
    phone: "+213 555 78 90 12"
  },
  { 
    id: 6, 
    name: "Dr. Youssef El Amrani", 
    specialty: "Ophtalmologie", 
    rating: 4.8, 
    reviews: 112, 
    image: "/Images/Dhomme4.png",
    experience: "14 ans",
    availability: ['9:00', '11:00', '13:30', '15:30'],
    bio: "Dr. El Amrani est spécialisé dans le diagnostic et le traitement des troubles oculaires.",
    address: "Cité 200 Logements, Nouvelle Ville Ali Mendjeli, Constantine 25000, Algérie",
    phone: "+213 661 23 45 67"
  },
  { 
    id: 7, 
    name: "Dr. Karim Meziane", 
    specialty: "Psychologie", 
    rating: 4.7, 
    reviews: 98, 
    image: "/Images/Dhomme5.png",
    experience: "10 ans",
    availability: ['10:00', '13:00', '15:30', '18:00'],
    bio: "Dr. Meziane est un psychologue expérimenté, spécialisé en thérapie cognitive et comportementale.",
    address: "Rue Hassiba Ben Bouali, Belouizdad, Alger 16015, Algérie",
    phone: "+213 661 45 78 90"
}
]

function FindDoctor() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedRating, setSelectedRating] = useState(0)
  const [doctors, setDoctors] = useState(mockDoctors)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [weekDays, setWeekDays] = useState([])
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const filteredDoctors = mockDoctors.filter(doctor => 
      (searchTerm === "" || doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialty === "" || doctor.specialty === selectedSpecialty) &&
      (selectedRating === 0 || doctor.rating >= selectedRating)
    )
    setDoctors(filteredDoctors)
  }, [searchTerm, selectedSpecialty, selectedRating])

  // Generate week days when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const days = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
          date: date,
          dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          timeSlots: selectedDoctor.availability,
        });
      }
      setWeekDays(days);
    }
  }, [selectedDoctor]);

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
    setSelectedDate("")
    setSelectedTime("")
    setBookingSuccess(false)
  }

  const handleDateSelection = (day) => {
    setSelectedDate(day.date.toISOString().split('T')[0])
  }

  const handleTimeSelection = (time) => {
    setSelectedTime(time)
  }

  const confirmAppointment = () => {
    // In a real app, this would make an API call to save the appointment
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingSuccess(false)
      setShowModal(false)
      setSelectedDoctor(null)
    }, 3000)
  }

  // Function to render stars based on rating
  const renderStars = rating => {
    const fullStars = Math.floor(rating); // Take only the integer part
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < fullStars ? 'star-icon' : 'star-icon inactive'}
        />
      );
    }
  
    return stars;
  };
  

  return (
    
    <div className="find-doctor-page">
      <Sidebar />
      <main className="main-content">
      <div className="search-section">
      <div className="search-text">
        <h1>Trouvez le médecin idéal</h1>
        <ProfileDropdown />
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom ou spécialité"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value))}
            className="filter-select"
          >
            <option value={0}>Toutes les notes</option>
            <option value={4}>4+ étoiles</option>
            <option value={4.5}>4.5+ étoiles</option>
          </select>
        </form>
      </div>

      <div className="results-section">
        <h2>Médecins disponibles ({doctors.length})</h2>
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="doctor-image" />
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialty">{doctor.specialty}</p>
                <p className="experience">{doctor.experience} d'expérience</p>
                <div className="doctor-rating">
                  {renderStars(doctor.rating)}
                  <span className="rating-number">{doctor.rating}</span>
                  <span className="reviews-count">({doctor.reviews} avis)</span>
                </div>
                <div className="doctor-location">
                  <FaMapMarkerAlt className="location-icon" />
                  <span>{doctor.address}</span>
                </div>
                <div className="doctor-phone">
                  <FaPhone className="phone-icon" />
                  <span>{doctor.phone}</span>
                </div>
              </div>
              <button 
                className="book-button" 
                onClick={() => handleBookAppointment(doctor)}
              >
                Prendre RDV
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => !bookingSuccess && setShowModal(false)}
        >
          <div className="appointment-modal" onClick={e => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => !bookingSuccess && setShowModal(false)}
            >
              ×
            </button>

            {bookingSuccess ? (
              <div className="booking-success">
                <div className="success-icon">✓</div>
                <h2>Rendez-vous confirmé !</h2>
                <p>
                  Votre rendez-vous avec {selectedDoctor.name} a été programmé
                  pour le {new Date(selectedDate).toLocaleDateString('fr-FR')} à{' '}
                  {selectedTime}.
                </p>
                <p>Une confirmation a été envoyée à votre email.</p>
              </div>
            ) : (
              <>
                <div className="modal-doctor-info">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="modal-doctor-image"
                  />
                  <div>
                    <h2>{selectedDoctor.name}</h2>
                    <p>{selectedDoctor.specialty}</p>
                    <p>{selectedDoctor.bio}</p>
                    <div className="doctor-rating">
                      {renderStars(selectedDoctor.rating)}
                      <span className="rating-number">
                        {selectedDoctor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="appointment-calendar">
                  <h3>Sélectionnez la date et l'heure du rendez-vous</h3>
                  <div className="calendar-header">
                    <Calendar />
                    <span>Créneaux disponibles pour les 7 prochains jours</span>
                  </div>

                  <div className="week-calendar">
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        className={`day-column ${
                          selectedDate === day.date.toISOString().split('T')[0]
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => handleDateSelection(day)}
                      >
                        <div className="day-header">
                          <div className="day-name">{day.dayName}</div>
                          <div className="day-number">{day.dayNumber}</div>
                          <div className="day-month">{day.month}</div>
                        </div>

                        {selectedDate ===
                          day.date.toISOString().split('T')[0] && (
                          <div className="time-slots">
                            {day.timeSlots.map((time, timeIndex) => (
                              <button
                                key={timeIndex}
                                className={`time-slot ${
                                  selectedTime === time ? 'selected' : ''
                                }`}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleTimeSelection(time);
                                }}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="appointment-summary">
                      <h3>Résumé du rendez-vous</h3>
                      <div className="summary-details">
                        <div className="summary-item">
                          <span className="summary-label">Médecin:</span>
                          <span className="summary-value">
                            {selectedDoctor.name}
                          </span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Date:</span>
                          <span className="summary-value">
                            {new Date(selectedDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Heure:</span>
                          <span className="summary-value">{selectedTime}</span>
                        </div>
                      </div>

                      <button
                        className="confirm-button"
                        onClick={confirmAppointment}
                      >
                        Confirmer le rendez-vous
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}</main>
    </div>
    
  )
}

export default FindDoctor