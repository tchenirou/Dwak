import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Overview.css"
import { Link } from "react-router-dom"
const Overview = () => {
  const scrollContainer = (direction) => {
    const container = document.querySelector(".doctors-scroll")
    const scrollAmount = 300
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="overview-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Découvrez Nos Services de Santé Complets</h1>
            <p>
              Dwak offre une gamme complète de services de santé en ligne, connectant patients et professionnels de
              santé pour des soins de qualité et accessibles.
            </p>
            <div className="cta-buttons">
            <Link to="/signup" className="primary-button">Commencer</Link>
              <button className="secondary-button">En savoir plus</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/Images/medical-services.png" alt="Services de santé en ligne" />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="features">
        <div className="container">
          <h2>Nos Services</h2>
          <div className="feature-cards">
            {services.map((service, index) => (
              <div key={index} className="feature-card">
                <img src={service.icon || "/placeholder.svg"} alt={service.title} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors and Opportunities */}
      <section className="future-healthcare">
        <div className="container">
          <div className="future-content">
            <h2>Nos Médecins et Opportunités</h2>
            <div className="future-cards">
              <div className="future-card">
                <h3>Médecins Qualifiés</h3>
                <p>Notre réseau comprend des professionnels de santé expérimentés dans divers domaines.</p>
              </div>
              <div className="future-card">
                <h3>Opportunités pour les Praticiens</h3>
                <p>Rejoignez notre plateforme pour développer votre pratique et atteindre plus de patients.</p>
              </div>
            </div>
            <Link to="/recrutement" className="primary-button">Rejoindre l'équipe</Link>
          </div>
          <div className="future-image">
            <img src="../Images/docteam.png" alt="Équipe médicale" />
          </div>  
        </div>
      </section>

      {/* Patient Services */}
      <section className="steps">
        <div className="container">
          <h2>Services aux Patients</h2>
          <div className="step-cards">
            {patientServices.map((service, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors-section">
        <div className="container">
          <h2>Nos Médecins</h2>
          <div className="doctors-container">
            <button className="scroll-button left" onClick={() => scrollContainer("left")} aria-label="Scroll left">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="doctors-scroll">
              {doctors.map((doctor, index) => (
                <div key={index} className="doctor-card">
                  <div className="doctor-image">
                    <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <p className="experience">{doctor.experience} années d'expérience</p>
                    <p className="consults">{doctor.consults} consultations effectuées</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollContainer("right")} aria-label="Scroll right">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>Comment ça marche</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p>Sélectionnez une spécialité ou un symptôme
              </p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p>Appel audio/vidéo avec un médecin vérifié
              </p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p>Obtenez une ordonnance numérique</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à Commencer?</h2>
            <p>Rejoignez Dwak aujourd'hui et accédez à des soins de santé de qualité, où que vous soyez.</p>
            <Link to="/signup" className="primary-button">S'inscrire Maintenant</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const services = [
  {
    title: "Consultations Vidéo",
    description: "Rencontrez des médecins en face à face via notre plateforme sécurisée.",
    icon: "../Images/video-consultation.png",
  },
  {
    title: "Chat Médical",
    description: "Obtenez des réponses rapides à vos questions de santé par chat.",
    icon: "../Images/DoctorChat.png",
  },
  {
    title: "Suivi des Patients",
    description: "Gérez vos rendez-vous et suivez votre historique médical en ligne.",
    icon: "../Images/SuivieDoc.png",
  },
  {
    title: "Prescriptions Électroniques",
    description: "Recevez vos ordonnances directement sur votre appareil.",
    icon: "../Images/Ordonnance.png",
  },
]

const patientServices = [
  {
    title: "Rendez-vous Faciles",
    description: "Prenez rendez-vous en quelques clics, 24/7.",
  },
  {
    title: "Dossier Médical Électronique",
    description: "Accédez à votre historique médical complet en ligne.",
  },
  {
    title: "Support Patient 24/7",
    description: "Notre équipe est là pour vous aider à tout moment.",
  },
]

const doctors = [
  {
    name: "Dr. Ahmed Kader",
    specialty: "Cardiologie",
    experience: 9,
    consults: 51113,
    image:
      "../Images/Dhomme1.png",
  },
  {
    name: "Dr. Sarah Benali",
    specialty: "Gynécologie",
    experience: 8,
    consults: 59026,
    image:
      "../Images/Dfemme2.png",
  },
  {
    name: "Dr. Karim Zidane",
    specialty: "Dermatologie",
    experience: 12,
    consults: 31856,
    image:
      "../Images/Dhomme2.png",
  },
  {
    name: "Dr. Amine Tazi",
    specialty: "Médecine générale",
    experience: 11,
    consults: 15684,
    image:
      "../Images/Dhomme3.png",
  },
  {
    name: "Dr. Amine Tazi",
    specialty: "Médecine générale",
    experience: 11,
    consults: 15684,
    image:
      "../Images/Dhomme3.png",
  },
  {
    name: "Dr. Amine Tazi",
    specialty: "Médecine générale",
    experience: 11,
    consults: 15684,
    image:
      "../Images/Dhomme3.png",
  },
  {
    name: "Dr. Amine Tazi",
    specialty: "Médecine générale",
    experience: 11,
    consults: 15684,
    image:
      "../Images/Dhomme3.png",
  },
]

export default Overview

