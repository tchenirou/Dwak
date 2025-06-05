"use client"

import { useState } from "react"
import { Check, ArrowRight, AlertTriangle, Calendar, Clock, Award, Heart, Shield, Users } from "lucide-react"
import "./recrutement.css"

function PracticienRecruit() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    specialty: "",
    practiceType: "",
    experience: "",
    workDescription: "",
    isRegistered: false,
    acceptTerms: false,
    acceptPrivacy: false,
    acceptContact: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("generaliste")

  const specialties = [
    "Médecine générale",
    "Pédiatrie",
    "Psychiatrie",
    "Dermatologie",
    "Gynécologie",
    "Cardiologie",
    "Ophtalmologie",
    "Neurologie",
  ]

  const practiceTypes = ["Libéral", "Salarié", "Mixte", "Remplaçant", "Interne"]

  const experienceLevels = ["Moins de 2 ans", "2 à 5 ans", "5 à 10 ans", "Plus de 10 ans"]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Le nom est requis"
    if (!formData.email) newErrors.email = "L'email est requis"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide"
    if (!formData.phone) newErrors.phone = "Le téléphone est requis"
    if (!formData.postalCode) newErrors.postalCode = "Le code postal est requis"
    if (!formData.specialty) newErrors.specialty = "La spécialité est requise"
    if (!formData.practiceType) newErrors.practiceType = "Le type de pratique est requis"
    if (!formData.experience) newErrors.experience = "L'expérience est requise"
    if (!formData.workDescription) newErrors.workDescription = "La description de votre pratique est requise"
    if (!formData.isRegistered) newErrors.isRegistered = "Vous devez confirmer être inscrit à l'Ordre des Médecins"
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation"
    if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "Vous devez accepter la politique de confidentialité"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Form submitted:", formData)
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          postalCode: "",
          specialty: "",
          practiceType: "",
          experience: "",
          workDescription: "",
          isRegistered: false,
          acceptTerms: false,
          acceptPrivacy: false,
          acceptContact: false,
        })
        alert("Votre demande a été envoyée avec succès ! Notre équipe vous contactera prochainement.")
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const testimonials = [
    {
      name: "Dr. Sarah Benali",
      specialty: "Médecine générale",
      quote:
        "Rejoindre Dwak a transformé ma pratique. Je peux désormais aider plus de patients tout en gardant un équilibre de vie professionnelle.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Dr. Karim Hadj",
      specialty: "Pédiatrie",
      quote:
        "La plateforme est intuitive et l'équipe technique est toujours disponible. Je recommande Dwak à tous mes collègues.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Dr. Amina Meziane",
      specialty: "Dermatologie",
      quote:
        "Grâce à Dwak, j'ai pu étendre ma patientèle au-delà de ma région et offrir des consultations de suivi plus flexibles.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="praticien-page-modern">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              Transformez votre pratique médicale avec <span className="highlight">Dwak</span>
            </h1>
            <p className="hero-subtitle">
              Rejoignez la première plateforme de télémédecine en Algérie et offrez des soins de qualité, où que vous
              soyez
            </p>
            <div className="hero-cta">
              <a href="#join-form" className="primary-button">
                Rejoindre l'équipe <ArrowRight size={18} />
              </a>
              <a href="#benefits" className="secondary-button">
                Découvrir les avantages
              </a>
            </div>
          </div>
        </div>
        <div className="hero-shape"></div>
      </div>

      <div className="container">
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Médecins partenaires</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-number">50K+</div>
            <div className="stat-label">Consultations par mois</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Award />
            </div>
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction médecins</div>
          </div>
        </section>

        <section id="benefits" className="benefits-section">
          <div className="section-header">
            <h2>
              Pourquoi rejoindre <span className="highlight">Dwak</span> ?
            </h2>
            <p>Nous offrons aux médecins une expérience professionnelle unique et valorisante</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Clock />
              </div>
              <h3>Flexibilité totale</h3>
              <p>Définissez vos propres horaires et travaillez quand vous le souhaitez, où que vous soyez</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Award />
              </div>
              <h3>Rémunération attractive</h3>
              <p>Bénéficiez d'une rémunération compétitive et de primes basées sur la qualité des soins</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Shield />
              </div>
              <h3>Sécurité et conformité</h3>
              <p>Plateforme sécurisée et conforme aux réglementations de santé en vigueur</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Heart />
              </div>
              <h3>Impact social</h3>
              <p>Contribuez à améliorer l'accès aux soins dans toutes les régions d'Algérie</p>
            </div>
          </div>
        </section>

        <section className="specialties-section">
          <div className="section-header">
            <h2>Nous recrutons dans toutes les spécialités</h2>
            <p>Que vous soyez généraliste ou spécialiste, nous avons besoin de votre expertise</p>
          </div>

          <div className="tabs">
            <div className="tab-headers">
              <button
                className={`tab-button ${activeTab === "generaliste" ? "active" : ""}`}
                onClick={() => setActiveTab("generaliste")}
              >
                Médecine générale
              </button>
              <button
                className={`tab-button ${activeTab === "specialiste" ? "active" : ""}`}
                onClick={() => setActiveTab("specialiste")}
              >
                Spécialistes
              </button>
              <button
                className={`tab-button ${activeTab === "autres" ? "active" : ""}`}
                onClick={() => setActiveTab("autres")}
              >
                Autres professions
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "generaliste" && (
                <div className="tab-panel">
                  <h3>Médecins généralistes</h3>
                  <p>
                    En tant que médecin généraliste, vous êtes au cœur de notre système de soins. Chez Dwak, vous
                    pourrez :
                  </p>
                  <ul className="check-list">
                    <li>
                      <Check className="check-icon" /> Réaliser des consultations de premier recours
                    </li>
                    <li>
                      <Check className="check-icon" /> Assurer le suivi des patients chroniques
                    </li>
                    <li>
                      <Check className="check-icon" /> Participer à la permanence des soins
                    </li>
                    <li>
                      <Check className="check-icon" /> Collaborer avec notre réseau de spécialistes
                    </li>
                  </ul>
                </div>
              )}
              {activeTab === "specialiste" && (
                <div className="tab-panel">
                  <h3>Médecins spécialistes</h3>
                  <p>Nous recherchons des spécialistes dans de nombreux domaines, notamment :</p>
                  <div className="specialties-grid">
                    <div className="specialty-item">Pédiatrie</div>
                    <div className="specialty-item">Dermatologie</div>
                    <div className="specialty-item">Psychiatrie</div>
                    <div className="specialty-item">Gynécologie</div>
                    <div className="specialty-item">Cardiologie</div>
                    <div className="specialty-item">Endocrinologie</div>
                    <div className="specialty-item">Ophtalmologie</div>
                    <div className="specialty-item">Neurologie</div>
                  </div>
                </div>
              )}
              {activeTab === "autres" && (
                <div className="tab-panel">
                  <h3>Autres professionnels de santé</h3>
                  <p>Nous développons également notre offre pour d'autres professionnels :</p>
                  <ul className="check-list">
                    <li>
                      <Check className="check-icon" /> Psychologues
                    </li>
                    <li>
                      <Check className="check-icon" /> Diététiciens
                    </li>
                    <li>
                      <Check className="check-icon" /> Sages-femmes
                    </li>
                    <li>
                      <Check className="check-icon" /> Infirmiers spécialisés
                    </li>
                  </ul>
                  <p className="note">* Sous réserve de la réglementation en vigueur</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="section-header">
            <h2>Ce que disent nos médecins partenaires</h2>
            <p>Découvrez les témoignages de médecins qui ont rejoint notre plateforme</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <p className="quote">"{testimonial.quote}"</p>
                </div>
                <div className="testimonial-author">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="join-form" className="join-section">
          <div className="join-container">
            <div className="join-content">
              <div className="section-header">
                <h2>Rejoignez l'équipe Dwak</h2>
                <p>Complétez le formulaire ci-dessous et notre équipe vous contactera rapidement</p>
              </div>

              <div className="form-notice">
                <AlertTriangle size={18} className="warning-icon" />
                <p>Ce formulaire est réservé aux professionnels de santé diplômés</p>
              </div>

              <form onSubmit={handleSubmit} className="join-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Nom complet*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr. Nom Prénom"
                      className={errors.name ? "error" : ""}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Adresse email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Numéro de téléphone*</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+213 XX XX XX XX"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Code postal*</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="16000"
                      className={errors.postalCode ? "error" : ""}
                    />
                    {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialty">Spécialité médicale*</label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className={errors.specialty ? "error" : ""}
                    >
                      <option value="">Sélectionnez votre spécialité</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && <div className="error-message">{errors.specialty}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="practiceType">Type de pratique*</label>
                    <select
                      id="practiceType"
                      name="practiceType"
                      value={formData.practiceType}
                      onChange={handleChange}
                      className={errors.practiceType ? "error" : ""}
                    >
                      <option value="">Sélectionnez votre type de pratique</option>
                      {practiceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.practiceType && <div className="error-message">{errors.practiceType}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">Expérience professionnelle*</label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={errors.experience ? "error" : ""}
                    >
                      <option value="">Sélectionnez votre expérience</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.experience && <div className="error-message">{errors.experience}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="workDescription">Description de votre pratique médicale*</label>
                  <textarea
                    id="workDescription"
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleChange}
                    placeholder="Décrivez votre expérience, vos domaines d'expertise et vos motivations pour rejoindre notre plateforme..."
                    rows="5"
                    className={errors.workDescription ? "error" : ""}
                  ></textarea>
                  {errors.workDescription && <div className="error-message">{errors.workDescription}</div>}
                </div>

                <div className="form-group checkbox-group">
                  <label className={`checkbox-label ${errors.isRegistered ? "error-label" : ""}`}>
                    <input
                      type="checkbox"
                      name="isRegistered"
                      checked={formData.isRegistered}
                      onChange={handleChange}
                    />
                    <span>Je confirme être inscrit(e) à l'Ordre des Médecins Algériens*</span>
                  </label>
                  {errors.isRegistered && <div className="error-message">{errors.isRegistered}</div>}
                </div>

                <div className="form-group checkbox-group">
                  <label className={`checkbox-label ${errors.acceptTerms ? "error-label" : ""}`}>
                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                    <span>
                      J'accepte les{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        conditions d'utilisation
                      </a>{" "}
                      de la plateforme Dwak*
                    </span>
                  </label>
                  {errors.acceptTerms && <div className="error-message">{errors.acceptTerms}</div>}
                </div>

                <div className="form-group checkbox-group">
                  <label className={`checkbox-label ${errors.acceptPrivacy ? "error-label" : ""}`}>
                    <input
                      type="checkbox"
                      name="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onChange={handleChange}
                    />
                    <span>
                      J'accepte la{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        politique de confidentialité
                      </a>{" "}
                      de Dwak*
                    </span>
                  </label>
                  {errors.acceptPrivacy && <div className="error-message">{errors.acceptPrivacy}</div>}
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="acceptContact"
                      checked={formData.acceptContact}
                      onChange={handleChange}
                    />
                    <span>J'accepte de recevoir des informations sur les services et événements de Dwak</span>
                  </label>
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      Envoyer ma candidature <ArrowRight className="arrow-icon" />
                    </>
                  )}
                </button>

                <p className="form-disclaimer">
                  En soumettant ce formulaire, vous acceptez que Dwak traite vos données conformément à notre politique
                  de confidentialité. Nous vous contacterons uniquement dans le cadre de votre candidature.
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-header">
            <h2>Questions fréquentes</h2>
            <p>Tout ce que vous devez savoir avant de rejoindre Dwak</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment fonctionne la rémunération ?</h3>
              <p>
                Nous proposons une rémunération compétitive basée sur le nombre de consultations réalisées. Vous recevez
                un paiement mensuel sécurisé directement sur votre compte bancaire.
              </p>
            </div>
            <div className="faq-item">
              <h3>Quel équipement est nécessaire ?</h3>
              <p>
                Vous aurez besoin d'un ordinateur avec webcam et microphone, ainsi qu'une connexion internet stable.
                Notre équipe technique vous guidera pour l'installation et la configuration.
              </p>
            </div>
            <div className="faq-item">
              <h3>Combien d'heures dois-je m'engager ?</h3>
              <p>
                Nous offrons une flexibilité totale. Vous pouvez commencer avec quelques heures par semaine et augmenter
                progressivement selon votre disponibilité.
              </p>
            </div>
            <div className="faq-item">
              <h3>Comment se déroule le processus de recrutement ?</h3>
              <p>
                Après soumission de votre candidature, nous vérifions vos qualifications, organisons un entretien vidéo,
                puis une formation à notre plateforme avant de commencer les consultations.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Prêt à transformer votre pratique médicale ?</h2>
          <p>Rejoignez les centaines de médecins qui font confiance à Dwak</p>
          <a href="#join-form" className="primary-button">
            Postuler maintenant <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PracticienRecruit

