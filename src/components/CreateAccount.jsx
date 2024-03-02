import React, { useState } from "react";
import { Card } from "./Context";

function CreateAccount() {
  const [show, setShow] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleCreateAccount = async () => {
    try {
      const url = `http://localhost:4000/account/create/${name}/${email}/${password}`;
      const res = await fetch(url);
      const data = await res.json();

      // Check for specific indicators of success or failure in the response
      if (data.success) {
        // Assuming that a successful response contains a 'name' property
        console.log("Account created for user:", email);
        setStatus("");
        setShow(false);
      } else {
        // Account creation failed
        console.log("Account creation failed");
        setStatus("fail!");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setStatus("fail!");
    }
  };

  const handleAuthenticateAgain = () => {
    setShow(true);
  };

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm
            name={name}
            email={email}
            password={password}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            handleCreateAccount={handleCreateAccount}
          />
        ) : (
          <CreateMsg setShow={handleAuthenticateAgain} />
        )
      }
    />
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleCreateAccount,
}) {
  return (
    <>
      Name
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <br />
      Email address
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      <button
        type="submit"
        className="btn btn-light"
        onClick={handleCreateAccount}
      >
        Create Account
      </button>
    </>
  );
}

export default CreateAccount;
