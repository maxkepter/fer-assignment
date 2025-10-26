import { Form } from "react-bootstrap";
import { useState } from "react";
import AuthService from "../../service/auth/AuthService";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  function handleConfirmPassword(value) {
    setConfirmPassword(value);
    setConfirmPassword(value);

    if (!value) {
      setErrorMessage("");
      return;
    }

    if (password !== value) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage("Fields cannot be empty");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");
    AuthService.register(username, password);
  }

  return (
    <div>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => handleConfirmPassword(e.target.value)}
          />
        </Form.Group>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button variant="primary" type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
}

export default Register;
