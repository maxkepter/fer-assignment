import { Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/auth/AuthService";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
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

  async function handleSubmit(e) {
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
    let data = await AuthService.register(username, password);
    if (data && data.success) {
      setSuccessMessage(data.message || "Registration successful");
      setShowSuccessModal(true);
    } else {
      setErrorMessage(data ? data.message : "Registration failed");
    }
  }

  function handleCloseSuccess() {
    setShowSuccessModal(false);
    navigate("/");
  }

  return (
    <div className="container-fluid">
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <Modal show={showSuccessModal} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage || "Your account has been created successfully."}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
