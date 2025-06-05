import React from 'react';
import { Routes, Route, Link, useLocation } from "react-router-dom"
function Home() {
    return (
      <>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Votre santé, notre priorité : consultations en ligne en direct</h1>
              <p>Bénéficiez de soins de santé dans le confort de votre foyer grâce à nos services de consultation 
                médicale en ligne.
            </p>
              <div className="cta-buttons">
                <Link to="/signup" className="primary-button">Consulter maintenant</Link>
                <button className="secondary-button">En savoir plus</button>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="/Images/DocThx.png"
                alt="Online consultation"
              />
            </div>
          </div>
        </section>
  
       
  
        {/* Rest of the sections from the original home page... */}
      </>
    )
  }
  
  export default Home
  
  
