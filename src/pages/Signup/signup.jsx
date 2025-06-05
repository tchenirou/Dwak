"use client";

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react'
import './signup.css'
function Signup() {
    
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
    acceptPrivacy: false,
    acceptNewsletter: false
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const validateStep = (currentStep) => {
    const newErrors = {}
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = "Champ obligatoire"
      if (!formData.lastName) newErrors.lastName = "Champ obligatoire"
    } else if (currentStep === 2) {
        if (!formData.email) {
            newErrors.email = "Champ obligatoire";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email invalide";
          }
          if (!formData.phone) {
            newErrors.phone = "Champ obligatoire";
          } else if (!/^\d{9,15}$/.test(formData.phone)) {
            newErrors.phone = "Numéro de téléphone invalide";
          }
          
    } else if (currentStep === 3) {
        if (!formData.password) {
          newErrors.password = "Champ obligatoire";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(formData.password)) {
          newErrors.password = "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial (@,#,..)";
        }
        if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions";
        if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "Vous devez accepter la politique de confidentialité";
      }
      

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1);
    setErrors({}); // Reset errors so buttons are re-enabled
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form from submitting automatically
  
      if (step === 3) {
        handleSubmit(e); // Submit if on last step
      } else {
        handleNext(); // Move to next step otherwise
      }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep(3)) {
        console.log("Form submitted:", formData);
        navigate("/login"); // Redirect to login after signup
      }
      
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  
    // Remove errors dynamically as the user types
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete newErrors[name]; // Remove the error if the field is filled
      }
      return newErrors;
    });
  };
  

  return (
    <div className="signup-page" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="signup-container">
        <div className="signup-header">
          {step > 1 && (
            <button onClick={handleBack} className="back-button">
              <ArrowLeft size={20} />
            </button>
          )}
          <Link to="/" className="close-button">
            <X size={20} />
          </Link>
        </div>

        {step === 1 && (
          <>
            <h1>Création de compte</h1>
            <p className="subtitle">Renseignez votre identité</p>
            
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

            <div className="info-message">
              Lors de la création du compte nous avons besoin que vous renseigniez l'identité de la personne adulte titulaire du compte.
            </div>

            <button onClick={handleNext} className="next-button" disabled={Object.keys(errors).length > 0}>
      Suivant
    </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Renseignez votre email et votre numéro de téléphone</h1>
            <p className="subtitle">
              L'email servira à vous connecter en toute sécurité. Le numéro de téléphone sera utile pour que le praticien puisse vous joindre en cas de problème.
            </p>

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
              <div className="phone-input">
                <select className="country-code">
                  <option value="DZ">DZ +213</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>

            <button onClick={handleNext} className="next-button" disabled={Object.keys(errors).length > 0}>
      Suivant
    </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1>Créez votre mot de passe</h1>
            <p className="subtitle">
              Votre mot de passe doit comprendre 8 caractères minimum, dont 1 chiffre, 1 majuscule, 1 minuscule et 1 caractère spécial (@,#,..)
            </p>

            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span>J'ai lu et j'accepte les <Link to="/terms">conditions générales d'utilisation et les conditions générales de vente</Link> de Dwak</span>
              </label>
              {errors.acceptTerms && <div className="error-message">{errors.acceptTerms}</div>}

              <label>
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleChange}
                />
                <span>J'ai lu, j'ai compris et j'accepte le traitement de mes données de santé pour le service Dwak précisé dans la <Link to="/privacy">notice d'information et de consentement</Link></span>
              </label>
              {errors.acceptPrivacy && <div className="error-message">{errors.acceptPrivacy}</div>}

              <label>
                <input
                  type="checkbox"
                  name="acceptNewsletter"
                  checked={formData.acceptNewsletter}
                  onChange={handleChange}
                />
                <span>Je veux recevoir les conseils santé Dwak pour améliorer ma santé au quotidien (1 newsletter par semaine en moyenne)</span>
              </label>
            </div>

            <button onClick={handleSubmit} className="submit-button" disabled={Object.keys(errors).length > 0}>
      Confirmer
    </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Signup