"use client"

import { useState, useEffect } from "react"
import {
  Search,
  UserPlus,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Eye,
} from "lucide-react"
import "./AdminDoctors.css"
import Sidebar from "../../../../component/SideBar/AdminSideBar/AdminSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"

const AdminDoctors = () => {
  // State for doctors data
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [doctorsPerPage] = useState(10)

  // State for modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  // State for doctor form
  const [doctorForm, setDoctorForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    address: "",
    bio: "",
    status: "active",
    avatar: "/placeholder.svg?height=200&width=200",
  })

  // State for selected doctor
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  // State for avatar preview
  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg?height=200&width=200")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("No file chosen")

  // Sample specialties
  const specialties = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Psychiatrist",
    "Orthopedic",
    "Gynecologist",
    "Ophthalmologist",
    "Dentist",
    "General Practitioner",
  ]

  // Sample data for doctors
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleDoctors = [
        {
          id: 1,
          name: "Dr. Amina Meziane",
          email: "amina.meziane@example.com",
          phone: "+213 555 123 456",
          specialty: "Cardiologist",
          experience: "10 years",
          address: "123 Medical Center, Algiers",
          bio: "Dr. Amina is a board-certified cardiologist with extensive experience in treating cardiovascular diseases.",
          patients: 120,
          rating: 4.8,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2020-05-15",
        },
        {
          id: 2,
          name: "Dr. Karim Benali",
          email: "karim.benali@example.com",
          phone: "+213 555 234 567",
          specialty: "Neurologist",
          experience: "8 years",
          address: "456 Health Plaza, Oran",
          bio: "Dr. Karim specializes in neurological disorders and has published several research papers in the field.",
          patients: 85,
          rating: 4.7,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2021-02-10",
        },
        {
          id: 3,
          name: "Dr. Leila Hadj",
          email: "leila.hadj@example.com",
          phone: "+213 555 345 678",
          specialty: "Pediatrician",
          experience: "12 years",
          address: "789 Children's Clinic, Constantine",
          bio: "Dr. Leila is passionate about children's health and has extensive experience in pediatric care.",
          patients: 150,
          rating: 4.9,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2019-08-22",
        },
        {
          id: 4,
          name: "Dr. Omar Taleb",
          email: "omar.taleb@example.com",
          phone: "+213 555 456 789",
          specialty: "Dermatologist",
          experience: "6 years",
          address: "101 Skin Care Center, Annaba",
          bio: "Dr. Omar specializes in treating various skin conditions and cosmetic dermatology.",
          patients: 95,
          rating: 4.6,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2022-01-05",
        },
        {
          id: 5,
          name: "Dr. Yasmine Kaci",
          email: "yasmine.kaci@example.com",
          phone: "+213 555 567 890",
          specialty: "Psychiatrist",
          experience: "9 years",
          address: "202 Mental Health Institute, Setif",
          bio: "Dr. Yasmine is dedicated to mental health awareness and treatment of psychological disorders.",
          patients: 65,
          rating: 4.5,
          status: "pending",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2023-03-15",
        },
        {
          id: 6,
          name: "Dr. Farid Bouaziz",
          email: "farid.bouaziz@example.com",
          phone: "+213 555 678 901",
          specialty: "Orthopedic",
          experience: "15 years",
          address: "303 Bone & Joint Clinic, Tlemcen",
          bio: "Dr. Farid is an experienced orthopedic surgeon specializing in sports injuries and joint replacements.",
          patients: 110,
          rating: 4.7,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2018-11-30",
        },
        {
          id: 7,
          name: "Dr. Nadia Rahmani",
          email: "nadia.rahmani@example.com",
          phone: "+213 555 789 012",
          specialty: "Gynecologist",
          experience: "11 years",
          address: "404 Women's Health Center, Batna",
          bio: "Dr. Nadia is dedicated to women's health and reproductive medicine.",
          patients: 130,
          rating: 4.8,
          status: "active",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2019-04-18",
        },
        {
          id: 8,
          name: "Dr. Youcef Mansouri",
          email: "youcef.mansouri@example.com",
          phone: "+213 555 890 123",
          specialty: "Ophthalmologist",
          experience: "7 years",
          address: "505 Eye Care Institute, Blida",
          bio: "Dr. Youcef specializes in diagnosing and treating eye disorders and vision problems.",
          patients: 75,
          rating: 4.6,
          status: "inactive",
          avatar: "/placeholder.svg?height=200&width=200",
          joinDate: "2021-09-12",
        },
      ]

      setDoctors(sampleDoctors)
      setFilteredDoctors(sampleDoctors)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort doctors
  useEffect(() => {
    let result = [...doctors]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((doctor) => doctor.status === statusFilter)
    }

    // Apply specialty filter
    if (specialtyFilter !== "all") {
      result = result.filter((doctor) => doctor.specialty === specialtyFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "rating") {
        comparison = a.rating - b.rating
      } else if (sortBy === "patients") {
        comparison = a.patients - b.patients
      } else if (sortBy === "joinDate") {
        comparison = new Date(a.joinDate) - new Date(b.joinDate)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredDoctors(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [doctors, searchQuery, statusFilter, specialtyFilter, sortBy, sortOrder])

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle doctor form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setDoctorForm({
      ...doctorForm,
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
        // Also update the doctorForm with the new avatar
        setDoctorForm({
          ...doctorForm,
          avatar: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form and preview when closing modals
  const resetForm = () => {
    setDoctorForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      specialty: "",
      experience: "",
      address: "",
      bio: "",
      status: "active",
      avatar: "/placeholder.svg?height=200&width=200",
    })
    setAvatarPreview("/placeholder.svg?height=200&width=200")
    setSelectedFile(null)
    setFileName("No file chosen")
  }

  // Handle add doctor
  const handleAddDoctor = (e) => {
    e.preventDefault()

    // Create new doctor with ID
    const newDoctor = {
      ...doctorForm,
      id: doctors.length + 1,
      patients: 0,
      rating: 0,
      joinDate: new Date().toISOString().split("T")[0],
      // Use the preview URL as the avatar
      avatar: avatarPreview,
    }

    // Add to doctors list
    setDoctors([...doctors, newDoctor])

    // Show success alert
    setAlert({
      show: true,
      message: `Dr. ${newDoctor.name} has been added successfully!`,
      type: "success",
    })

    // Close modal and reset form
    setShowAddDoctorModal(false)
    resetForm()

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle edit doctor
  const handleEditDoctor = (e) => {
    e.preventDefault()

    // Update doctor in list with the current avatar preview
    const updatedDoctorForm = {
      ...doctorForm,
      avatar: avatarPreview,
    }

    const updatedDoctors = doctors.map((doctor) => (doctor.id === doctorForm.id ? updatedDoctorForm : doctor))

    setDoctors(updatedDoctors)

    // Show success alert
    setAlert({
      show: true,
      message: `Dr. ${doctorForm.name}'s information has been updated!`,
      type: "success",
    })

    // Close modal
    setShowEditDoctorModal(false)

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle delete doctor
  const handleDeleteDoctor = () => {
    // Remove doctor from list
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== selectedDoctor.id)

    setDoctors(updatedDoctors)

    // Show success alert
    setAlert({
      show: true,
      message: `Dr. ${selectedDoctor.name} has been removed from the system!`,
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
  const handleStatusChange = (doctor, newStatus) => {
    // Update doctor status
    const updatedDoctors = doctors.map((d) => (d.id === doctor.id ? { ...d, status: newStatus } : d))

    setDoctors(updatedDoctors)

    // Show success alert
    setAlert({
      show: true,
      message: `Dr. ${doctor.name}'s status has been updated to ${newStatus}!`,
      type: "success",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Open edit modal
  const openEditModal = (doctor) => {
    setDoctorForm({ ...doctor })
    setAvatarPreview(doctor.avatar)
    setFileName("Current image")
    setShowEditDoctorModal(true)
  }

  // Open delete modal
  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDeleteModal(true)
  }

  // Open view modal
  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowViewModal(true)
  }

  // Export doctors data
  const exportDoctorsData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exporting doctors data...")
  }

  return (
    <div className="admin-doctors-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <ProfileDropdown />
        <div className="page-header">
          <div>
            <h1>Doctor Management</h1>
            <p>Manage all doctors in the system</p>
          </div>
          <div className="header-actions">
            <button className="export-button" onClick={exportDoctorsData}>
              <Download size={16} />
              Export
            </button>
            <button className="add-button" onClick={() => setShowAddDoctorModal(true)}>
              <UserPlus size={16} />
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-container">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search doctors by name, email or specialty..."
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
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Specialty:</label>
              <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
                <option value="all">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="patients">Patients</option>
                <option value="joinDate">Join Date</option>
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

        {/* Doctors Table */}
        <div className="doctors-table-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="empty-state">
              <p>No doctors found matching your criteria.</p>
              <button
                className="reset-button"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setSpecialtyFilter("all")
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Contact</th>
                    <th>Patients</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="doctor-cell">
                        <img src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} className="doctor-avatar" />
                        <div className="doctor-info">
                          <div className="doctor-name">{doctor.name}</div>
                          <div className="doctor-experience">{doctor.experience} experience</div>
                        </div>
                      </td>
                      <td>{doctor.specialty}</td>
                      <td>
                        <div className="contact-info">
                          <div>{doctor.email}</div>
                          <div>{doctor.phone}</div>
                        </div>
                      </td>
                      <td>{doctor.patients}</td>
                      <td>
                        <div className="rating">
                          <span className="rating-value">{doctor.rating}</span>
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star ${i < Math.floor(doctor.rating) ? "filled" : ""}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${doctor.status}`}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-button view"
                            title="View Details"
                            onClick={() => openViewModal(doctor)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-button edit"
                            title="Edit Doctor"
                            onClick={() => openEditModal(doctor)}
                          >
                            <Edit size={16} />
                          </button>
                          {doctor.status === "active" ? (
                            <button
                              className="action-button suspend"
                              title="Deactivate Doctor"
                              onClick={() => handleStatusChange(doctor, "inactive")}
                            >
                              <AlertCircle size={16} />
                            </button>
                          ) : doctor.status === "inactive" ? (
                            <button
                              className="action-button activate"
                              title="Activate Doctor"
                              onClick={() => handleStatusChange(doctor, "active")}
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <>
                              <button
                                className="action-button approve"
                                title="Approve Doctor"
                                onClick={() => handleStatusChange(doctor, "active")}
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                className="action-button reject"
                                title="Reject Doctor"
                                onClick={() => handleStatusChange(doctor, "inactive")}
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button
                            className="action-button delete"
                            title="Delete Doctor"
                            onClick={() => openDeleteModal(doctor)}
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

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="modal-overlay">
          <div className="modal doctor-modal">
            <div className="modal-header">
              <h3>Add New Doctor</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowAddDoctorModal(false)
                  resetForm()
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddDoctor}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={doctorForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty">Specialty</label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={doctorForm.specialty}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>
                          {specialty}
                        </option>
                      ))}
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
                      value={doctorForm.email}
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
                      value={doctorForm.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience">Experience</label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={doctorForm.experience}
                      onChange={handleFormChange}
                      placeholder="e.g. 5 years"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={doctorForm.status} onChange={handleFormChange}>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={doctorForm.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Professional Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={doctorForm.bio}
                    onChange={handleFormChange}
                    rows="4"
                    required
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
                      setShowAddDoctorModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditDoctorModal && (
        <div className="modal-overlay">
          <div className="modal doctor-modal">
            <div className="modal-header">
              <h3>Edit Doctor</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowEditDoctorModal(false)
                  resetForm()
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditDoctor}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-name">Full Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={doctorForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-specialty">Specialty</label>
                    <select
                      id="edit-specialty"
                      name="specialty"
                      value={doctorForm.specialty}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>
                          {specialty}
                        </option>
                      ))}
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
                      value={doctorForm.email}
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
                      value={doctorForm.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-experience">Experience</label>
                    <input
                      type="text"
                      id="edit-experience"
                      name="experience"
                      value={doctorForm.experience}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-status">Status</label>
                    <select id="edit-status" name="status" value={doctorForm.status} onChange={handleFormChange}>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-address">Address</label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    value={doctorForm.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-bio">Professional Bio</label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    value={doctorForm.bio}
                    onChange={handleFormChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  <div className="avatar-preview-container">
                    <img src={avatarPreview || "/placeholder.svg"} alt="Doctor Avatar" className="avatar-preview" />
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
                      setShowEditDoctorModal(false)
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

      {/* View Doctor Modal */}
      {showViewModal && selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal view-doctor-modal">
            <div className="modal-header">
              <h3>Doctor Details</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="doctor-profile">
                <div className="doctor-profile-header">
                  <img
                    src={selectedDoctor.avatar || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                    className="doctor-profile-avatar"
                  />
                  <div className="doctor-profile-info">
                    <h2>{selectedDoctor.name}</h2>
                    <p className="doctor-profile-specialty">{selectedDoctor.specialty}</p>
                    <div className="doctor-profile-rating">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < Math.floor(selectedDoctor.rating) ? "filled" : ""}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-value">{selectedDoctor.rating}</span>
                    </div>
                    <span className={`status-badge ${selectedDoctor.status}`}>
                      {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="doctor-profile-details">
                  <div className="detail-group">
                    <h4>Contact Information</h4>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedDoctor.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedDoctor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedDoctor.address}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h4>Professional Information</h4>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{selectedDoctor.experience}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Patients:</span>
                      <span className="detail-value">{selectedDoctor.patients}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Join Date:</span>
                      <span className="detail-value">{selectedDoctor.joinDate}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h4>Biography</h4>
                    <p className="doctor-bio">{selectedDoctor.bio}</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowViewModal(false)
                    openEditModal(selectedDoctor)
                  }}
                >
                  <Edit size={16} />
                  Edit Doctor
                </button>
                {selectedDoctor.status === "active" ? (
                  <button
                    className="btn-warning"
                    onClick={() => {
                      handleStatusChange(selectedDoctor, "inactive")
                      setShowViewModal(false)
                    }}
                  >
                    <AlertCircle size={16} />
                    Deactivate Doctor
                  </button>
                ) : (
                  <button
                    className="btn-success"
                    onClick={() => {
                      handleStatusChange(selectedDoctor, "active")
                      setShowViewModal(false)
                    }}
                  >
                    <CheckCircle size={16} />
                    Activate Doctor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
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
                Are you sure you want to delete <strong>{selectedDoctor.name}</strong>? This action cannot be undone.
              </p>
              <p className="warning-text">
                All associated data including appointments and patient relationships will be permanently removed.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteDoctor}>
                Delete Doctor
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
  )
}

export default AdminDoctors

