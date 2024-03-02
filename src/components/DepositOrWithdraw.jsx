import React, { useState, useEffect } from "react";
import { Card } from "./Context";

function Transaction() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [transactionType, setTransactionType] = useState("deposit"); // "deposit" or "withdraw"
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch and display the user's balance when the component loads
    fetchBalance();
  }, []);

  const fetchBalance = () => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(
        `http://localhost:4000/account/balance/${encodeURIComponent(userEmail)}`
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

  function handleTransactionTypeChange(newTransactionType) {
    setTransactionType(newTransactionType);
    setShow(true);
    setError("");
    setSuccess(false);
    setStatus("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setError("No user email found");
      return;
    }

    let transactionAmount = parseFloat(amount);
    if (transactionType === "withdraw") {
      if (transactionAmount > balance) {
        setError("Withdrawal amount exceeds balance.");
        return;
      }
      transactionAmount = -transactionAmount; // Make the amount negative for withdrawal
    }
    const encodedEmail = encodeURIComponent(userEmail);
    const url = `http://localhost:4000/account/update/${encodedEmail}/${transactionAmount}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If the new balance is in the response, use it to update the state.
          if (data.balance !== undefined) {
            setBalance(data.balance);
          } else {
            // If the new balance is not in the response, fetch it again.
            fetchBalance();
          }
          setSuccess(true);
          // setStatus(
          //   `${
          //     transactionType.charAt(0).toUpperCase() + transactionType.slice(1)
          //   } successful!`
          // );
          setAmount(""); // Clear the amount field after a successful transaction
        } else {
          setError(data.message || `Failed to ${transactionType}`);
        }
      })
      .catch((error) => {
        setError(`Failed to ${transactionType}`);
        console.error(`Error during ${transactionType}:`, error);
      });
  };

  const TransactionMsg = () => (
    <>
      <h5>Success</h5>
      <button
        type="button"
        className="btn btn-light"
        onClick={() => setShow(true)}
      >
        {transactionType === "deposit" ? "Deposit" : "Withdraw"} again
      </button>
    </>
  );

  return (
    <>
      <div className="d-flex justify-content-center mb-3">
        <button
          onClick={() => handleTransactionTypeChange("deposit")}
          className={`btn ${
            transactionType === "deposit" ? "btn-success" : "btn-light"
          } mx-2`}
        >
          Deposit
        </button>
        <button
          onClick={() => handleTransactionTypeChange("withdraw")}
          className={`btn ${
            transactionType === "withdraw" ? "btn-warning" : "btn-light"
          } mx-2`}
        >
          Withdraw
        </button>
      </div>
      <Card
        bgcolor={transactionType === "deposit" ? "success" : "warning"}
        header={transactionType === "deposit" ? "Deposit" : "Withdraw"}
        status={status}
        body={
          show ? (
            <form onSubmit={handleSubmit}>
              <h2>
                {transactionType === "deposit"
                  ? "Deposit Funds"
                  : "Withdraw Funds"}
              </h2>

              {balance !== null && (
                <p className="balance-display">
                  <strong>Balance:</strong>{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(balance)}
                </p>
              )}
              <div>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.currentTarget.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-light mt-2">
                {transactionType === "deposit" ? "Deposit" : "Withdraw"}
              </button>
              {error && <p className="text-danger">Error: {error}</p>}
              {success && (
                <p className="text-white">
                  {transactionType.charAt(0).toUpperCase() +
                    transactionType.slice(1)}{" "}
                  successful!
                </p>
              )}
            </form>
          ) : (
            <TransactionMsg />
          )
        }
      />
    </>
  );
}

export default Transaction;
