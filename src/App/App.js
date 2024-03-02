import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Balance from "../components/Balance.jsx";
import AllData from "../components/AllData.jsx";
import "./App.css";
import Login from "../components/Login.jsx";
import CreateAccount from "../components/CreateAccount.jsx";
import Home from "../components/Home.jsx";
import Welcome from "../components/Welcome.jsx";
import { AuthContext } from "../auth/authContext.js";
import Sidebar from "../components/Sidebar.jsx";
import Transaction from "../components/DepositOrWithdraw.jsx";
import TransactionBetweenUsers from "../components/TransactionBetweenUsers.jsx";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      {isLoggedIn ? (
        // Layout for logged-in users with Sidebar
        <div className="d-flex" style={{ height: "100vh" }}>
          <Sidebar />
          <div className="content flex-grow-1 p-3">
            <Routes>
              {/* Protected and common routes here */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/alldata" element={<AllData />} />
              <Route path="/depositorwithdraw" element={<Transaction />} />
              <Route
                path="/transactionbetweenusers"
                element={<TransactionBetweenUsers />}
              />
            </Routes>
          </div>
        </div>
      ) : (
        // Layout for non-logged-in users with NavBar at the top
        <>
          <NavBar />
          <div className="container mt-3">
            <Routes>
              {/* Common routes available for all users */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              {/* More routes */}
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;
