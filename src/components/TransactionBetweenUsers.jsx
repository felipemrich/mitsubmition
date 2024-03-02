import React, { useEffect, useState } from "react";
import { Card } from "./Context";

function TransferFunds() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [transferStatus, setTransferStatus] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Add user email state

  const fetchBalance = () => {
    const userEmailFromLocalStorage = localStorage.getItem("userEmail");
    if (userEmailFromLocalStorage) {
      fetch(
        `http://localhost:4000/account/balance/${encodeURIComponent(
          userEmailFromLocalStorage
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setBalance(data.balance);
          } else {
            setError(data.message);
          }
        })
        .catch((err) => {
          setError("Error fetching balance");
        });
    } else {
      setError("No user email found");
    }
  };

  useEffect(() => {
    // Fetch user balance here similar to your Balance component
    // Replace the URL with your actual endpoint to fetch the balance
    const userEmailFromLocalStorage = localStorage.getItem("userEmail");
    if (userEmailFromLocalStorage) {
      // Set user email state
      setUserEmail(userEmailFromLocalStorage);

      fetch(
        `http://localhost:4000/account/balance/${encodeURIComponent(
          userEmailFromLocalStorage
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

  const handleTransfer = () => {
    if (balance >= parseFloat(amount)) {
      fetch(
        `http://localhost:4000/account/transfer/${localStorage.getItem(
          "userEmail"
        )}/${recipientEmail}/${amount}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setTransferStatus("Transfer successful");
            fetchBalance();
          } else {
            setTransferStatus("Transfer failed: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error during transfer:", error);
          setTransferStatus("Transfer failed: Internal error");
        });
    } else {
      setTransferStatus("Not enough balance to make the transfer");
    }
  };

  return (
    <div>
      <Card
        bgcolor="info"
        header="Transfer Funds"
        status={
          error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )
        }
        body={
          <>
            {loading && <p>Loading balance...</p>}
            {balance !== null && (
              <p>
                <strong>Current Balance:</strong> ${balance}
              </p>
            )}

            {/* Display user's email here */}
            <p>
              <strong>Email:</strong> {userEmail}
            </p>

            <div>
              <label htmlFor="recipientEmail">Recipient Email:</label>
              <input
                type="text"
                className="form-control"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-light mt-2"
              onClick={handleTransfer}
            >
              Transfer
            </button>
            {transferStatus && <p>{transferStatus}</p>}
          </>
        }
      />
    </div>
  );
}

export default TransferFunds;
