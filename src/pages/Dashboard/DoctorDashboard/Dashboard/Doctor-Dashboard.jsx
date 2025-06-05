import React from 'react';
import { Calendar, Clock, Users, DollarSign, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Doctor-Dashboard.css';
import Sidebar from "../../../../component/SideBar/DoctorSideBar/DoctorSideBar"
import ProfileDropdown from "../../../../component/Dashboards/Profilepic/ProfileDropdown"
const DoctorDashboard = () => {
  // Sample data
  const stats = {
    earnings: {
      total: 12500,
      thisMonth: 6500,
      lastMonth: 4000
    },
    appointments: {
      total: 10,
      upcoming: 3,
      completed: 7
    },
    patients: {
      total: 15,
      new: 8,
      returning:7 
    }
  };

  const recentBookings = [
    { id: 1, patient: "Amina Bensalem", date: "2025-03-01", time: "10:30 AM", type: "Follow-up", status: "Confirmed" },
    { id: 2, patient: "Issam Haddad", date: "2025-03-01", time: "2:00 PM", type: "Initial Consultation", status: "Confirmed" },
    { id: 3, patient: "Nadia Cherif", date: "2025-03-02", time: "9:15 AM", type: "Check-up", status: "Pending" },
    { id: 4, patient: "Mehdi Belkacem", date: "2025-03-02", time: "11:45 AM", type: "Follow-up", status: "Confirmed" },
    { id: 5, patient: "Sofia Mansouri", date: "2025-03-03", time: "3:30 PM", type: "Initial Consultation", status: "Confirmed" }
];


  const earningsGrowth = Math.round(((stats.earnings.thisMonth - stats.earnings.lastMonth) / stats.earnings.lastMonth) * 100);

  return (
    <div className="doctor-dashboard-container">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Dr. Meziane Dashboard</h1>
          <p>Bienvenue à nouveau ! Voici un aperçu de votre pratique.</p>
        </div>

        {/* Stats Cards */}
        <div className="info-cards-grid">
          {/* Earnings Card */}
          <div className="info-card">
            <div className="info-card-content">
              <div className="stat-icon-container">
                <DollarSign size={24} className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Bénéfice total</p>
                <h2 className="stat-value">{stats.earnings.total} DZD </h2>
                <div className="stat-details">
                  <span>Ce mois-ci : {stats.earnings.thisMonth}DZD </span>
                  <span className={`stat-growth ${earningsGrowth >= 0 ? 'positive' : 'negative'}`}>
                    {earningsGrowth}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="info-card">
            <div className="info-card-content">
              <div className="stat-icon-container">
                <Calendar size={24} className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Consultation</p>
                <h2 className="stat-value">{stats.appointments.total}</h2>
                <div className="stat-details">
                  <span>à venir: {stats.appointments.upcoming}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Card */}
          <div className="info-card">
            <div className="info-card-content">
              <div className="stat-icon-container">
                <Users size={24} className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Nombre total de patients</p>
                <h2 className="stat-value">{stats.patients.total}</h2>
                <div className="stat-details">
                  <span>Nouveau ce mois-ci : {stats.patients.new}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bookings-container">
          <div className="bookings-header">
            <h3>Latest Bookings</h3>
          </div>
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & heure</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="patient-name">{booking.patient}</td>
                    <td>
                      <div className="booking-date">{booking.date}</div>
                      <div className="booking-time">
                        <Clock size={12} />
                        {booking.time}
                      </div>
                    </td>
                    <td>{booking.type}</td>
                    <td>
                      <span className={`status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <Link to="/doctor-appointments" className="action-button">
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bookings-footer">
            <Link to="/doctor-appointments" className="view-all-button">
             Voir tous les rendez-vous
            </Link>
          </div>
        </div>
      </div>

      {/* Right Sidebar for additional functionality */}
      <div className="right-sidebar">
      <ProfileDropdown />
      </div>
    </div>
  );
};

export default DoctorDashboard;