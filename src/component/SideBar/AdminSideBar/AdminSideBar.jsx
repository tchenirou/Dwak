import { Link } from "react-router-dom"
import {
  Home,
  Users,
  Calendar,
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  DollarSign,
  Shield,
  Activity,
} from "lucide-react"
import "./AdminSideBar.css"

const AdminSideBar = () => {
  return (
    <div className="admin-sidebar">
      
        <Link to="/" className="logo-container">
          <img src="/Images/logo2.png" alt="Dwak Logo" className="logo" />
        </Link>
      

      <nav className="sidebar-nav">
        <Link to="/admin-dashboard" className="nav-item active">
          <Home className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link to="/admin-doctors" className="nav-item">
          <Users className="nav-icon" />
          <span className="nav-text">Doctors</span>
        </Link>

        <Link to="/admin-patients" className="nav-item">
          <Activity className="nav-icon" />
          <span className="nav-text">Patients</span>
        </Link>

        <Link to="/admin-appointments" className="nav-item">
          <Calendar className="nav-icon" />
          <span className="nav-text">Appointments</span>
        </Link>
        <Link to="/admin-settings" className="nav-item">
          <Settings className="nav-icon" />
          <span className="nav-text">Settings</span>
        </Link>
      </nav>
    </div>
  )
}

export default AdminSideBar

