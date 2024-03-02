import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/authContext"; // Ensure this path is correct
import { Card } from "./Context";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const url = `https://felipe-leaofullstackbankingapplication.com/account/login/${encodeURIComponent(
        email
      )}/${encodeURIComponent(password)}`;
      const res = await fetch(url, {
        method: "GET", // Consider changing this to POST for security
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true); // Update login state
        localStorage.setItem("userEmail", email); // Store email in localStorage
        navigate("/welcome"); // Redirect to Welcome page
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={""} // You may want to use a state to handle status messages
      body={
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      }
    />
  );
}

function LoginForm(props) {
  return (
    <>
      Email
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={props.email}
        onChange={(e) => props.setEmail(e.currentTarget.value)}
      />
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={props.password}
        onChange={(e) => props.setPassword(e.currentTarget.value)}
      />
      <br />
      <button
        type="submit"
        className="btn btn-light"
        onClick={props.handleLogin}
      >
        Login
      </button>
    </>
  );
}

export default Login;
