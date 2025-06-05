import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";
import { Search , Home, Calendar, FileText, User } from "lucide-react";


const navigationItems = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", path: "/patient-dashboard" },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Consultations",
      path: "/Appointments",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Documents",
      path: "/documents",
    },
    { icon: <User className="w-5 h-5" />, label: "Compte", path: "/settings" },

    { icon:< Search className="w-5 h5"/> , label: "Consulter Dr", path: "/find-doctor" },
  ]
const Sidebar = () => {
    
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <Link to="/" className="logo-container">
          <img src="/Images/logo2.png" alt="Dwak Logo" className="logo" />
        </Link>

        <nav className="nav-items">
          {navigationItems.map((item, index) => (
            <Link key={index} to={item.path} className="nav-item">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
