import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  // Function to apply active styles
  const getNavLinkClass = (isActive) => {
    return isActive
      ? "nav-link text-center text-white active d-flex align-items-center justify-content-center"
      : "nav-link text-center text-black d-flex align-items-center justify-content-center";
  };

  return (
    <Navbar bg="light" expand="lg" expanded={expanded}>
      <NavLink className="navbar-brand" to="/" style={{ marginLeft: "1rem" }}>
        <img
          src={`${process.env.PUBLIC_URL}/icons/bebank.svg`}
          alt="Bee Bank Logo"
          height="30"
          className="d-inline-block align-top"
        />
      </NavLink>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded(expanded ? false : "expanded")}
        style={{ marginRight: "1rem" }}
      />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav className="mr-auto">
          <NavLink
            to="/home"
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={() => setExpanded(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={() => setExpanded(false)}
          >
            Login
          </NavLink>
          <NavLink
            to="/createaccount"
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={() => setExpanded(false)}
          >
            Create Account
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
