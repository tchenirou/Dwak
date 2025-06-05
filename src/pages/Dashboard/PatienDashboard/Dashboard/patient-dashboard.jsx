"use client"

import { Home, Calendar, FileText, User, Gift, Search, ChevronRight, Clock, PlusCircle } from "lucide-react"
import "./patient-dashboard.css"
import { Link } from "react-router-dom"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown";
import Sidebar from "../../../../component/SideBar/PatientSideBar/SideBar"
const PatientDashboard = () => {

  const infoCards = [
    {
      title: "Tiers payant : comment en bénéficier ?",
      image: "https://via.placeholder.com/400x200",
      link: "/payment-info",
    },
    {
      title: "Santé mentale : comment consulter un psychologue ?",
      image: "https://via.placeholder.com/400x200",
      link: "/mental-health",
    },
    {
      title: "Pour quels motifs téléconsulter un médecin généraliste ?",
      image: "https://via.placeholder.com/400x200",
      link: "/teleconsultation",
    },
    {
      title: "Est-ce possible de recevoir une ordonnance en ligne ?",
      image: "../Images/online-prescription.png",
      link: "/online-prescription",
    },
  ]

  return (
    
    <div className="patient-dashboard-container">
      {/* Sidebar */}
      <Sidebar />
      

      {/* Main Content */}
      <main className="main-content">
        

        {/* Info Cards Grid */}
        <div className="info-cards-grid">
          {infoCards.map((card, index) => (
            <Link key={index} to={card.link} className="info-card">
              <div className="info-card-image">
                <img src={card.image || "/placeholder.svg"} alt={card.title} />
              </div>
              <div className="info-card-content">
                <h3>{card.title}</h3>
                <ChevronRight className="chevron-icon" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        {/* Quick Consultation */}
        <ProfileDropdown />
    <Link to={"/find-doctor"} className="consult-button">
      <div className="doctors-preview">
        <div className="doctor-avatars">
          <img src="../Images/dr-face1.png" alt="Doctor 1" className="doctor-avatar" />
          <img src="../Images/dr-face2.png" alt="Doctor 2" className="doctor-avatar" />
          <img src="../Images/dr-face3.png" alt="Doctor 3" className="doctor-avatar" />
        </div>
        <div className="estimated-time">Estimé dans 22 min</div>
      </div>
      <div className="consult-info">
      <div className="consult-text">
        <h3>Consulter maintenant</h3>
        <p>2500 DZD • 30 min </p>
        </div>
        <div className="chevron-icon">➜</div>
      </div>
      
    </Link>
  
      </aside>
    </div>
    
  )
}

export default PatientDashboard

