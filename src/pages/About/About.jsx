import React, { useState, useEffect } from "react";

// Array of team members with their details
const teamMembers = [
  {
    id: 1,
    name: "Salmi Rafik",
    role: "Etudiant L3",
    bio: "Startup Memoire PFC",
    image: "/Images/sova.png"
  },
  {
    id: 2,
    name: "Tas Alaa Eddine",
    role: "Etudiant L3",
    bio: "Startup Memoire PFC",
    image: "/Images/alaa-tas.png"
  },
  {
    id: 3,
    name: "Boudjema Mohamed Nadir",
    role: "Etudiant L3",
    bio: "Startup Memoire PFC",
    image: "/Images/nadir.png"
  }
];

function About() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll to show/hide the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setHeaderVisible(false); // Hide navbar when scrolling down
      } else {
        setHeaderVisible(true); // Show navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* About Hero Section */}
      <section
        className="about-hero"
        style={{
          marginTop: headerVisible ? "100px" : "0px",
          transition: "margin-top 0.3s ease-in-out",
        }}
      >
        <div className="container">
          <h1>À propos</h1>
          <p className="subtitle">
            En tant que leader reconnu et premier spécialiste de la téléconsultation en Algerie, agréé par le Ministère de la Santé,
            Dwak facilite l'accès aux soins en connectant patients et médecins. Notre plateforme permet d'obtenir une téléconsultation en toute confiance, dans la journée, 7j/7, où que vous soyez.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2>Notre mission</h2>
            <p>
              Garantir à tous les Algeriens des soins de qualité dans des délais adaptés à leurs besoins de santé
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>999+</h3>
              <p>Utilisateur active</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>prestataire de santé</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Assistance disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <h2>Notre équipe</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={`Team member ${member.name}`} />
                </div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2>Nos valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Qualité médicale</h3>
              <p>Les médecins sont tous inscrits au Conseil de l’ordre et sont formés à la téléconsultation grâce à notre propre organisme de formation.</p>
            </div>
            <div className="value-card">
              <h3>Sécurité des données</h3>
              <p>Les données de nos patients et professionnels de santé sont stockées chez un hébergeur certifié</p>
            </div>
            <div className="value-card">
              <h3>Santé physique & mentale</h3>
              <p>Nous considérons que la santé mentale est aussi importante que la santé physique et que les deux ne doivent pas être traitées séparément. Nous innovons pour une approche holistique de la santé.</p>
            </div>
            <div className="value-card">
              <h3>Innovations</h3>
              <p>Nous offrons en Algérie un service de téléconsultation médicale avancé, intégré à des objets connectés et des applications numériques.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
