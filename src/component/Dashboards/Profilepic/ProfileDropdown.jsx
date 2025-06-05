import React, { useState, useEffect } from "react";
import "./ProfileDropdown.css";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getUserRole } from "../../../utils/authUtils"; // Import the getUserRole function

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation(); // Get current path
    const navigate = useNavigate(); // To navigate programmatically after logout

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Redirect to login page
    };

    // Determine the correct dashboard link based on role
    let dashboardLink = "/"; // Default fallback

    // Get the user's role from the utility function
    const userRole = getUserRole();

    if (userRole) {
        // Set the dashboard link based on the user's role
        if (userRole === "patient") {
            dashboardLink = "/patient-dashboard";
        } else if (userRole === "doctor") {
            dashboardLink = "/doctor-dashboard";
        } else if (userRole === "admin") {
            dashboardLink = "/admin-dashboard";
        } else {
            // Default fallback, maybe show an error page or redirect to home
            dashboardLink = "/";
        }
    } else {
        // If there's no token or the role is not found, redirect to login
        dashboardLink = "/login";
    }

    return (
        <div className="profile-container">
            <div className="profile-header" onClick={() => setIsOpen(!isOpen)}>
                <img src="../Images/nadir.png" alt="Profile" className="profile-picture" />
                {!isMobile && (
                    <>
                        <ChevronDown size={18} color="#0b0051" />
                    </>
                )}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <Link to={dashboardLink} className="dropdown-item">Dashboard</Link>
                    <button className="dropdown-item logout" onClick={handleLogout}>Déconnexion</button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
