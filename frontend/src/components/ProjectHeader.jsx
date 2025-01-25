import React from "react";

export default function MyHeader() {
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
          style={{margin: "0 10px", textDecoration: "none", color: "#ffffff", // Blue color for links
          }}
        >
          Home
        </a>
        <a
          href="/show"
          style={{margin: "0 10px", textDecoration: "none", color: "#ffffff",
          }}
        >
          Projects Demos
        </a>
      </nav>
    </header>
  );
}
