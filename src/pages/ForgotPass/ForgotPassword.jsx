"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, Key, Check, Eye, EyeOff, Lock } from 'lucide-react'
import './ForgotPassword.css'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("L'email est requis")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(2)
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    const code = verificationCode.join("")
    if (code.length !== 6) {
      setError("Le code doit contenir 6 chiffres")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(3)
    } catch (error) {
      setError("Code invalide. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple digits
    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=code-${index + 1}]`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=code-${index - 1}]`)
      if (prevInput) prevInput.focus()
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {!success ? (
          <>
            <div className="steps-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-icon">
                  <Mail className="icon" />
                </div>
                <span>Email</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-icon">
                  <Key className="icon" />
                </div>
                <span>Code</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-icon">
                  <Lock className="icon" />
                </div>
                <span>Nouveau mot de passe</span>
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="form-step">
                <h1>Mot de passe oublié ?</h1>
                <p className="subtitle">
                  Entrez votre adresse e-mail et nous vous enverrons un code de réinitialisation
                </p>

                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse email"
                    className={error ? 'error' : ''}
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Envoi en cours..." : "Envoyer le code"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleCodeSubmit} className="form-step">
                <button type="button" onClick={() => setStep(1)} className="back-button">
                  <ArrowLeft className="icon" /> Retour
                </button>

                <h1>Vérification</h1>
                <p className="subtitle">
                  Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
                </p>

                <div className="verification-code">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`code-${index}`}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      maxLength={1}
                      pattern="\d*"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Vérification..." : "Vérifier"}
                </button>

                <button type="button" className="resend-button">
                  Renvoyer le code
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="form-step">
                <button type="button" onClick={() => setStep(2)} className="back-button">
                  <ArrowLeft className="icon" /> Retour
                </button>

                <h1>Nouveau mot de passe</h1>
                <p className="subtitle">
                  Créez un nouveau mot de passe sécurisé
                </p>

                <div className="form-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="form-group password-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="password-requirements">
                  <p>Le mot de passe doit contenir :</p>
                  <ul>
                    <li className={newPassword.length >= 8 ? 'valid' : ''}>
                      <Check className="icon" /> 8 caractères minimum
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                      <Check className="icon" /> Une majuscule
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'valid' : ''}>
                      <Check className="icon" /> Une minuscule
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>
                      <Check className="icon" /> Un chiffre
                    </li>
                    <li className={/[!@#$%^&*]/.test(newPassword) ? 'valid' : ''}>
                      <Check className="icon" /> Un caractère spécial
                    </li>
                  </ul>
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Modification..." : "Modifier le mot de passe"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="success-step">
            <div className="success-icon">
              <Check className="icon" size={48} />
            </div>
            <h1>Mot de passe modifié !</h1>
            <p>Votre mot de passe a été modifié avec succès.</p>
            <Link to="/login" className="login-link">
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword