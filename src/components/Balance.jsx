import React, { useEffect, useState } from "react";
import { Card } from "./Context";

function Balance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(
        `https://walrus-app-cb2fc.ondigitalocean.app/account/balance/${encodeURIComponent(
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
          if (data.success) {
            setBalance(data.balance);
          } else {
            throw new Error("Failed to fetch balance");
          }
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
          setError("Failed to fetch balance");
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
      bgcolor="info"
      header="Balance"
      status={
        error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )
      }
      body={
        balance !== null && (
          <div className="card-body">
            <p className="card-text">
              <strong>Balance:</strong> $
              {new Intl.NumberFormat("en-US", {
                style: "decimal",
                minimumFractionDigits: 2,
              }).format(balance)}
            </p>
          </div>
        )
      }
    />
  );
}

export default Balance;
