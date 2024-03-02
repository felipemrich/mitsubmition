import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPiggyBank,
  FaBalanceScale,
  FaDatabase,
  FaUser,
  FaExchangeAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../auth/authContext.js";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetch(
        `https://felipe-leaofullstackbankingapplication.com/account/find/${encodeURIComponent(
          userEmail
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user.length > 0) {
            setUserName(capitalizeFirstLetter(data.user[0].name));
          } else {
            console.error("User not found");
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext); // Assuming you have a setter like this in your context

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem("userEmail");
    // Update context to set user as logged out
    setIsLoggedIn(false);
    // Redirect to the home page
    navigate("/home");
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ width: "280px", height: "100vh" }}
    >
      <NavLink
        to="/welcome"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        end
      >
        <img
          src={`${process.env.PUBLIC_URL}/icons/bebank.svg`}
          alt="Bee Bank Logo"
          width="40"
          height="32"
          className="d-inline-block align-top"
        />
        <span className="fs-2">Bee Bank</span>
      </NavLink>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/welcome"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-white active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            <FaHome size={20} className="me-2" /> Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/depositorwithdraw"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-white active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            <FaPiggyBank size={20} className="me-2" /> Desposit/Withdraw
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/transactionbetweenusers"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-white active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            <FaExchangeAlt size={20} className="me-2" /> Transaction
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/balance"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-white active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            <FaBalanceScale size={20} className="me-2" /> Balance
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/alldata"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-white active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            <FaDatabase size={20} className="me-2" /> AllData
          </NavLink>
        </li>
      </ul>
      <div
        className="mt-auto"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div className="d-flex justify-content-between text-white p-3">
          <div className="d-flex align-items-center">
            <FaUser size={20} className="me-2" />
            <span>{userName || "Loading..."}</span>
          </div>
          <div
            style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.3)" }}
          ></div>

          <div className="d-flex align-items-center">
            <NavLink
              to="/home"
              className="d-flex align-items-center text-white"
            >
              <FaSignOutAlt size={20} className="me-2" onClick={handleLogout} />{" "}
              {/* Optional: Text "Log Out" */}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
