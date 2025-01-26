import React from "react";
import { useNavigate } from "react-router-dom";

export default function MyHeader() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id"); // Check if the user is logged in

  const handleProjectManagementClick = () => {
    navigate("/central"); // Redirect to '/central'
  };

  return (
    <header
      style={{
        position: "sticky", // Makes the header stick at the top
        top: 0, // Sticks to the top of the page
        zIndex: 1000, // Ensures it stays on top of other elements
        backgroundColor: "#181818", // Background color
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for visual separation
        padding: "10px 20px", // Adds spacing
        display: "flex", // Flexbox layout for content alignment
        justifyContent: "space-between", // Spreads items horizontally
        alignItems: "center", // Centers items vertically
      }}
    >
      <h2 style={{ fontSize: "1 rem", margin: 0, color: "#ffffff" }}>MIT 2.009X Product Engineering Process</h2>
      <nav>
        <a
          href="/"
          style={{
            margin: "0 10px",
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          Home
        </a>
        <a
          href="/show"
          style={{
            margin: "0 10px",
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          Demos
        </a>
        {/* Conditionally render the "Project Management" link */}
        {userId && (
          <a
            href="/central"
            style={{
              margin: "0 10px",
              textDecoration: "none",
              color: "#ffffff",
            }}
          >
            Management
          </a>
        )}
      </nav>
    </header>
  );
}
