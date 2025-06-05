"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import './contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis"
    if (!formData.lastName) newErrors.lastName = "Le nom est requis"
    if (!formData.email) newErrors.email = "L'email est requis"
    if (!formData.subject) newErrors.subject = "Le sujet est requis"
    if (!formData.message) newErrors.message = "Le message est requis"
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitSuccess(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p className="subtitle">
            Notre équipe est là pour vous aider. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info">
        <div className="container">
          <div className="info-cards">
            <div className="info-card">
              <Phone className="info-icon" />
              <h3>Téléphone</h3>
              <p>+213 671451774</p>
              <p className="availability">
                <Clock className="time-icon" />
                Dim - Jeu, 9h - 18h
              </p>
            </div>
            <div className="info-card">
              <Mail className="info-icon" />
              <h3>Email</h3>
              <p>support@dwak.com</p>
              <p className="availability">Réponse sous 24h</p>
            </div>
            <div className="info-card">
              <MapPin className="info-icon" />
              <h3>Adresse</h3>
              <p>route de sidi bel abess, N101, Ain Temouchent 46000</p>
              <p>Ain Temouchent, Algérie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-content">
              <h2>Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nom"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet"
                    className={errors.subject ? 'error' : ''}
                  />
                  {errors.subject && <div className="error-message">{errors.subject}</div>}
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows="5"
                    className={errors.message ? 'error' : ''}
                  ></textarea>
                  {errors.message && <div className="error-message">{errors.message}</div>}
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer <Send className="send-icon" size={18} />
                    </>
                  )}
                </button>

                {submitSuccess && (
                  <div className="success-message">
                    Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                  </div>
                )}
              </form>
            </div>
            <div className="form-image">
              <img
                src="/Images/CustomerService.png"
                alt="Contact illustration"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact