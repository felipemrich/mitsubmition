import React from "react";

function Welcome() {
  const userEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage

  return (
    <div>
      <h1>Hello, {userEmail}</h1>
    </div>
  );
}

export default Welcome;
