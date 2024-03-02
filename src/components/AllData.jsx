import React, { useEffect, useState } from "react";
import { Card } from "./Context"; // Import Card from wherever the Context component is located

function AllData() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(
        `https://felipe-leaofullstackbankingapplication.com/account/find/${encodeURIComponent(
          userEmail
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success && data.user.length > 0) {
            setUserData(data.user[0]);
          } else {
            throw new Error("User not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No user email found");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Card
      bgcolor="primary"
      header="User Data"
      status={
        error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )
      }
      body={
        userData && (
          <div className="card-body">
            <p className="card-text">
              <strong>Name:</strong> {userData.name}
            </p>
            <hr className="my-3" /> {/* Horizontal rule with Y-axis margin */}
            <p className="card-text">
              <strong>Email:</strong>
              <span className="email" title={userData.email}>
                {userData.email}
              </span>
            </p>
            <hr className="my-3" /> {/* Horizontal rule with Y-axis margin */}
            <p className="card-text">
              <strong>Balance:</strong> $
              {new Intl.NumberFormat("en-US", {
                style: "decimal",
                minimumFractionDigits: 2,
              }).format(userData.balance)}
            </p>
          </div>
        )
      }
    />
  );
}

export default AllData;
