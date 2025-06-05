"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Filter, Edit, Trash2, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Download, Upload, Eye, Calendar, FileText, Phone, Mail, MapPin, User } from 'lucide-react'
import "./AdminPatients.css"
import Sidebar from "../../../../component/SideBar/AdminSideBar/AdminSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"

const AdminPatients = () => {
  // State for patients data
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage] = useState(10)

  // State for modals
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showEditPatientModal, setShowEditPatientModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // State for patient form
  const [patientForm, setPatientForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    dob: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    status: "active",
    avatar: "/placeholder.svg?height=200&width=200",
  })

  // State for selected patient
  const [selectedPatient, setSelectedPatient] = useState(null)

  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  // State for avatar preview
  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg?height=200&width=200")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("No file chosen")

  // Sample data for patients
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const samplePatients = [
        {
          id: 1,
          name: "Ahmed Bouaziz",
          email: "ahmed.bouaziz@example.com",
          phone: "+213 555 123 456",
          address: "123 Main St, Algiers",
          gender: "Male",
          dob: "1985-06-15",
          bloodGroup: "A+",
          allergies: "Penicillin",
          medicalHistory: "Hypertension, Diabetes",
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          lastVisit: "2023-05-10",
          assignedDoctor: "Dr. Amina Meziane",
          appointments: [
            { id: 101, date: "2023-06-20", time: "10:00 AM", doctor: "Dr. Amina Meziane", status: "confirmed" },
            { id: 102, date: "2023-04-15", time: "2:30 PM", doctor: "Dr. Karim Benali", status: "completed" }
          ],
          medicalRecords: [
            { id: 201, date: "2023-04-15", title: "Annual Checkup", doctor: "Dr. Karim Benali", notes: "Patient is in good health. Blood pressure normal." },
            { id: 202, date: "2022-11-03", title: "Flu Vaccination", doctor: "Dr. Leila Hadj", notes: "Administered seasonal flu vaccine." }
          ]
        },
        {
          id: 2,
          name: "Fatima Zahra",
          email: "fatima.zahra@example.com",
          phone: "+213 555 234 567",
          address: "456 Oak Ave, Oran",
          gender: "Female",
          dob: "1990-03-22",
          bloodGroup: "O+",
          allergies: "None",
          medicalHistory: "Asthma",
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          lastVisit: "2023-05-18",
          assignedDoctor: "Dr. Leila Hadj",
          appointments: [
            { id: 103, date: "2023-06-25", time: "11:30 AM", doctor: "Dr. Leila Hadj", status: "confirmed" }
          ],
          medicalRecords: [
            { id: 203, date: "2023-05-18", title: "Asthma Follow-up", doctor: "Dr. Leila Hadj", notes: "Asthma well controlled. Continued current medication." },
            { id: 204, date: "2023-01-12", title: "Allergy Testing", doctor: "Dr. Omar Taleb", notes: "No significant allergies detected." }
          ]
        },
        {
          id: 3,
          name: "Mohammed Larbi",
          email: "mohammed.larbi@example.com",
          phone: "+213 555 345 678",
          address: "789 Pine Rd, Constantine",
          gender: "Male",
          dob: "1978-11-30",
          bloodGroup: "B-",
          allergies: "Sulfa drugs",
          medicalHistory: "Coronary artery disease",
          status: "inactive",
          avatar: "/placeholder.svg?height=200&width=200",
          lastVisit: "2022-12-05",
          assignedDoctor: "Dr. Karim Benali",
          appointments: [],
          medicalRecords: [
            { id: 205, date: "2022-12-05", title: "Cardiac Evaluation", doctor: "Dr. Amina Meziane", notes: "Stable condition. Continued medication." },
            { id: 206, date: "2022-08-17", title: "Blood Work", doctor: "Dr. Farid Bouaziz", notes: "Cholesterol levels slightly elevated." }
          ]
        },
        {
          id: 4,
          name: "Nour El Houda",
          email: "nour.elhouda@example.com",
          phone: "+213 555 456 789",
          address: "321 Cedar Ln, Batna",
          gender: "Female",
          dob: "1995-09-08",
          bloodGroup: "AB+",
          allergies: "None",
          medicalHistory: "None",
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          lastVisit: "2023-05-22",
          assignedDoctor: "Dr. Yasmine Kaci",
          appointments: [
            { id: 104, date: "2023-06-30", time: "9:15 AM", doctor: "Dr. Yasmine Kaci", status: "confirmed" }
          ],
          medicalRecords: [
            { id: 207, date: "2023-05-22", title: "General Checkup", doctor: "Dr. Yasmine Kaci", notes: "Patient is in excellent health." }
          ]
        },
        {
          id: 5,
          name: "Youcef Amir",
          email: "youcef.amir@example.com",
          phone: "+213 555 567 890",
          address: "567 Maple Dr, Annaba",
          gender: "Male",
          dob: "1982-07-14",
          bloodGroup: "O-",
          allergies: "Peanuts",
          medicalHistory: "Anxiety disorder",
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          lastVisit: "2023-04-30",
          assignedDoctor: "Dr. Nadia Rahmani",
          appointments: [
            { id: 105, date: "2023-07-05", time: "3:45 PM", doctor: "Dr. Nadia Rahmani", status: "pending" }
          ],
          medicalRecords: [
            { id: 208, date: "2023-04-30", title: "Psychiatric Evaluation", doctor: "Dr. Nadia Rahmani", notes: "Anxiety well managed with current treatment." },
            { id: 209, date: "2023-02-14", title: "Therapy Session", doctor: "Dr. Nadia Rahmani", notes: "Patient showing improvement in coping mechanisms." }
          ]
        }
      ]

      setPatients(samplePatients)
      setFilteredPatients(samplePatients)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort patients
  useEffect(() => {
    let result = [...patients]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((patient) => patient.status === statusFilter)
    }

    // Apply gender filter
    if (genderFilter !== "all") {
      result = result.filter((patient) => patient.gender.toLowerCase() === genderFilter.toLowerCase())
    }

    // Apply age filter
    if (ageFilter !== "all") {
      const currentYear = new Date().getFullYear()
      
      if (ageFilter === "0-18") {
        result = result.filter((patient) => {
          const birthYear = new Date(patient.dob).getFullYear()
          const age = currentYear - birthYear
          return age <= 18
        })
      } else if (ageFilter === "19-40") {
        result = result.filter((patient) => {
          const birthYear = new Date(patient.dob).getFullYear()
          const age = currentYear - birthYear
          return age > 18 && age <= 40
        })
      } else if (ageFilter === "41-65") {
        result = result.filter((patient) => {
          const birthYear = new Date(patient.dob).getFullYear()
          const age = currentYear - birthYear
          return age > 40 && age <= 65
        })
      } else if (ageFilter === "65+") {
        result = result.filter((patient) => {
          const birthYear = new Date(patient.dob).getFullYear()
          const age = currentYear - birthYear
          return age > 65
        })
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "lastVisit") {
        comparison = new Date(a.lastVisit) - new Date(b.lastVisit)
      } else if (sortBy === "dob") {
        comparison = new Date(a.dob) - new Date(b.dob)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredPatients(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [patients, searchQuery, statusFilter, genderFilter, ageFilter, sortBy, sortOrder])

  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle patient form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setPatientForm({
      ...patientForm,
      [name]: value,
    })
  }

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)

      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        // Also update the patientForm with the new avatar
        setPatientForm({
          ...patientForm,
          avatar: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form and preview when closing modals
  const resetForm = () => {
    setPatientForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "male",
      dob: "",
      bloodGroup: "",
      allergies: "",
      medicalHistory: "",
      status: "active",
      avatar: "/placeholder.svg?height=200&width=200",
    })
    setAvatarPreview("/placeholder.svg?height=200&width=200")
    setSelectedFile(null)
    setFileName("No file chosen")
  }

  // Handle add patient
  const handleAddPatient = (e) => {
    e.preventDefault()

    // Create new patient with ID
    const newPatient = {
      ...patientForm,
      id: patients.length + 1,
      lastVisit: new Date().toISOString().split("T")[0],
      assignedDoctor: "Unassigned",
      appointments: [],
      medicalRecords: [],
      // Use the preview URL as the avatar
      avatar: avatarPreview,
    }

    // Add to patients list
    setPatients([...patients, newPatient])

    // Show success alert
    setAlert({
      show: true,
      message: `${newPatient.name} has been added successfully!`,
      type: "success",
    })

    // Close modal and reset form
    setShowAddPatientModal(false)
    resetForm()

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle edit patient
  const handleEditPatient = (e) => {
    e.preventDefault()

    // Update patient in list with the current avatar preview
    const updatedPatientForm = {
      ...patientForm,
      avatar: avatarPreview,
    }

    const updatedPatients = patients.map((patient) => (patient.id === patientForm.id ? updatedPatientForm : patient))

    setPatients(updatedPatients)

    // Show success alert
    setAlert({
      show: true,
      message: `${patientForm.name}'s information has been updated!`,
      type: "success",
    })

    // Close modal
    setShowEditPatientModal(false)

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle delete patient
  const handleDeletePatient = () => {
    // Remove patient from list
    const updatedPatients = patients.filter((patient) => patient.id !== selectedPatient.id)

    setPatients(updatedPatients)

    // Show success alert
    setAlert({
      show: true,
      message: `${selectedPatient.name} has been removed from the system!`,
      type: "success",
    })

    // Close modal
    setShowDeleteModal(false)

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle status change
  const handleStatusChange = (patient, newStatus) => {
    // Update patient status
    const updatedPatients = patients.map((p) => (p.id === patient.id ? { ...p, status: newStatus } : p))

    setPatients(updatedPatients)

    // Show success alert
    setAlert({
      show: true,
      message: `${patient.name}'s status has been updated to ${newStatus}!`,
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Open edit modal
  const openEditModal = (patient) => {
    setPatientForm({ ...patient })
    setAvatarPreview(patient.avatar)
    setFileName("Current image")
    setShowEditPatientModal(true)
  }

  // Open delete modal
  const openDeleteModal = (patient) => {
    setSelectedPatient(patient)
    setShowDeleteModal(true)
  }

  // Open view modal
  const openViewModal = (patient) => {
    setSelectedPatient(patient)
    setActiveTab("info")
    setShowViewModal(true)
  }

  // Export patients data
  const exportPatientsData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exporting patients data...")
  }

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="admin-patients-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <ProfileDropdown />
        <div className="page-header">
          <div>
            <h1>Patient Management</h1>
            <p>Manage all patients in the system</p>
          </div>
          <div className="header-actions">
            <button className="export-button" onClick={exportPatientsData}>
              <Download size={16} />
              Export
            </button>
            <button className="add-button" onClick={() => setShowAddPatientModal(true)}>
              <UserPlus size={16} />
              Add New Patient
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-container">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search patients by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Gender:</label>
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Age Group:</label>
              <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                <option value="all">All Ages</option>
                <option value="0-18">0-18 years</option>
                <option value="19-40">19-40 years</option>
                <option value="41-65">41-65 years</option>
                <option value="65+">65+ years</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="lastVisit">Last Visit</option>
                <option value="dob">Date of Birth</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order:</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <button className="filter-button">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="patients-table-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="empty-state">
              <p>No patients found matching your criteria.</p>
              <button
                className="reset-button"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setGenderFilter("all")
                  setAgeFilter("all")
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Age/Gender</th>
                    <th>Last Visit</th>
                    <th>Assigned Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="patient-cell">
                        <img src={patient.avatar || "/placeholder.svg"} alt={patient.name} className="patient-avatar" />
                        <div className="patient-info">
                          <div className="patient-name">{patient.name}</div>
                          <div className="patient-id">ID: P-{String(patient.id).padStart(4, '0')}</div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div>{patient.email}</div>
                          <div>{patient.phone}</div>
                        </div>
                      </td>
                      <td>{calculateAge(patient.dob)} / {patient.gender}</td>
                      <td>{formatDate(patient.lastVisit)}</td>
                      <td>{patient.assignedDoctor}</td>
                      <td>
                        <span className={`status-badge ${patient.status}`}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-button view"
                            title="View Details"
                            onClick={() => openViewModal(patient)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-button edit"
                            title="Edit Patient"
                            onClick={() => openEditModal(patient)}
                          >
                            <Edit size={16} />
                          </button>
                          {patient.status === "active" ? (
                            <button
                              className="action-button suspend"
                              title="Deactivate Patient"
                              onClick={() => handleStatusChange(patient, "inactive")}
                            >
                              <AlertCircle size={16} />
                            </button>
                          ) : (
                            <button
                              className="action-button activate"
                              title="Activate Patient"
                              onClick={() => handleStatusChange(patient, "active")}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            className="action-button delete"
                            title="Delete Patient"
                            onClick={() => openDeleteModal(patient)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`pagination-page ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal-overlay">
          <div className="modal patient-modal">
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowAddPatientModal(false)
                  resetForm()
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddPatient}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={patientForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={patientForm.gender}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={patientForm.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={patientForm.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={patientForm.dob}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={patientForm.bloodGroup}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={patientForm.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="allergies">Allergies</label>
                    <input
                      type="text"
                      id="allergies"
                      name="allergies"
                      value={patientForm.allergies}
                      onChange={handleFormChange}
                      placeholder="Enter allergies or 'None'"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={patientForm.status} onChange={handleFormChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="medicalHistory">Medical History</label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={patientForm.medicalHistory}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Enter relevant medical history or 'None'"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  <div className="avatar-preview-container">
                    <img src={avatarPreview || "/placeholder.svg"} alt="Avatar Preview" className="avatar-preview" />
                  </div>
                  <div className="file-upload">
                    <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} />
                    <label htmlFor="avatar" className="file-upload-label">
                      <Upload size={16} />
                      Choose File
                    </label>
                    <span className="file-name">{fileName}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddPatientModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditPatientModal && (
        <div className="modal-overlay">
          <div className="modal patient-modal">
            <div className="modal-header">
              <h3>Edit Patient</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowEditPatientModal(false)
                  resetForm()
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditPatient}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-name">Full Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={patientForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-gender">Gender</label>
                    <select
                      id="edit-gender"
                      name="gender"
                      value={patientForm.gender}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-email">Email</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={patientForm.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-phone">Phone</label>
                    <input
                      type="tel"
                      id="edit-phone"
                      name="phone"
                      value={patientForm.phone}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-phone">Phone</label>
                    <input
                      type="tel"
                      id="edit-phone"
                      name="phone"
                      value={patientForm.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-dob">Date of Birth</label>
                    <input
                      type="date"
                      id="edit-dob"
                      name="dob"
                      value={patientForm.dob}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-bloodGroup">Blood Group</label>
                    <select
                      id="edit-bloodGroup"
                      name="bloodGroup"
                      value={patientForm.bloodGroup}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-address">Address</label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    value={patientForm.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-allergies">Allergies</label>
                    <input
                      type="text"
                      id="edit-allergies"
                      name="allergies"
                      value={patientForm.allergies}
                      onChange={handleFormChange}
                      placeholder="Enter allergies or 'None'"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-status">Status</label>
                    <select id="edit-status" name="status" value={patientForm.status} onChange={handleFormChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-medicalHistory">Medical History</label>
                  <textarea
                    id="edit-medicalHistory"
                    name="medicalHistory"
                    value={patientForm.medicalHistory}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Enter relevant medical history or 'None'"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  <div className="avatar-preview-container">
                    <img src={avatarPreview || "/placeholder.svg"} alt="Patient Avatar" className="avatar-preview" />
                  </div>
                  <div className="file-upload">
                    <input type="file" id="edit-avatar" name="avatar" accept="image/*" onChange={handleFileChange} />
                    <label htmlFor="edit-avatar" className="file-upload-label">
                      <Upload size={16} />
                      Change Photo
                    </label>
                    <span className="file-name">{fileName}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowEditPatientModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal view-patient-modal">
            <div className="modal-header">
              <h3>Patient Details</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="patient-profile">
                <div className="patient-profile-header">
                  <img
                    src={selectedPatient.avatar || "/placeholder.svg"}
                    alt={selectedPatient.name}
                    className="patient-profile-avatar"
                  />
                  <div className="patient-profile-info">
                    <h2>{selectedPatient.name}</h2>
                    <p className="patient-profile-id">Patient ID: P-{String(selectedPatient.id).padStart(4, '0')}</p>
                    <span className={`status-badge ${selectedPatient.status}`}>
                      {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="patient-tabs">
                  <div 
                    className={`patient-tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    <User size={16} /> Personal Info
                  </div>
                  <div 
                    className={`patient-tab ${activeTab === 'medical' ? 'active' : ''}`}
                    onClick={() => setActiveTab('medical')}
                  >
                    <FileText size={16} /> Medical Records
                  </div>
                  <div 
                    className={`patient-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                  >
                    <Calendar size={16} /> Appointments
                  </div>
                </div>

                {activeTab === 'info' && (
                  <div className="patient-profile-details">
                    <div className="detail-group">
                      <h4>Personal Information</h4>
                      <div className="detail-item">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">{selectedPatient.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Gender:</span>
                        <span className="detail-value">{selectedPatient.gender}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date of Birth:</span>
                        <span className="detail-value">{formatDate(selectedPatient.dob)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">{calculateAge(selectedPatient.dob)} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Blood Group:</span>
                        <span className="detail-value">{selectedPatient.bloodGroup || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>Contact Information</h4>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedPatient.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedPatient.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{selectedPatient.address}</span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>Medical Information</h4>
                      <div className="detail-item">
                        <span className="detail-label">Allergies:</span>
                        <span className="detail-value">{selectedPatient.allergies || 'None'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Medical History:</span>
                        <span className="detail-value">{selectedPatient.medicalHistory || 'None'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Assigned Doctor:</span>
                        <span className="detail-value">{selectedPatient.assignedDoctor}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Visit:</span>
                        <span className="detail-value">{formatDate(selectedPatient.lastVisit)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'medical' && (
                  <div className="medical-records">
                    <h4>Medical Records</h4>
                    {selectedPatient.medicalRecords && selectedPatient.medicalRecords.length > 0 ? (
                      selectedPatient.medicalRecords.map((record) => (
                        <div className="medical-record-item" key={record.id}>
                          <div className="medical-record-date">{formatDate(record.date)}</div>
                          <div className="medical-record-title">{record.title}</div>
                          <div className="medical-record-doctor">Doctor: {record.doctor}</div>
                          <p>{record.notes}</p>
                        </div>
                      ))
                    ) : (
                      <p>No medical records available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="appointments-list">
                    <h4>Appointments</h4>
                    {selectedPatient.appointments && selectedPatient.appointments.length > 0 ? (
                      selectedPatient.appointments.map((appointment) => (
                        <div className="appointment-item" key={appointment.id}>
                          <div className="appointment-date">
                            <div className="appointment-day">
                              {new Date(appointment.date).getDate()}
                            </div>
                            <div className="appointment-month">
                              {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>
                          <div className="appointment-details">
                            <div className="appointment-time">{appointment.time}</div>
                            <div className="appointment-doctor">{appointment.doctor}</div>
                          </div>
                          <div className="appointment-status">
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No appointments scheduled.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowViewModal(false)
                    openEditModal(selectedPatient)
                  }}
                >
                  <Edit size={16} />
                  Edit Patient
                </button>
                {selectedPatient.status === "active" ? (
                  <button
                    className="btn-danger"
                    onClick={() => {
                      handleStatusChange(selectedPatient, "inactive")
                      setShowViewModal(false)
                    }}
                  >
                    <AlertCircle size={16} />
                    Deactivate Patient
                  </button>
                ) : (
                  <button
                    className="btn-success"
                    onClick={() => {
                      handleStatusChange(selectedPatient, "active")
                      setShowViewModal(false)
                    }}
                  >
                    <CheckCircle size={16} />
                    Activate Patient
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{selectedPatient.name}</strong>? This action cannot be undone.
              </p>
              <p className="warning-text">
                All associated data including medical records and appointments will be permanently removed.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeletePatient}>
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert/Notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPatients;
