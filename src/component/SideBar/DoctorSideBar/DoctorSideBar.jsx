import React from "react";
import { Link } from "react-router-dom";
import "../PatientSideBar/SideBar.css";
import { DollarSign , Home, Calendar, User } from "lucide-react";

const navigationItems = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", path: "/doctor-dashboard" },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Consultations",
      path: "/doctor-appointments",
    },
    { icon: <User className="w-5 h-5" />, label: "Compte", path: "/doctor-settings" },

    { icon:< DollarSign className="w-5 h5"/> , label: "Finances", path: "/finances" },
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
