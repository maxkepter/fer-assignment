import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthService from "../../service/auth/AuthService";
import { UserContext } from "../../UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    let data = await AuthService.login(username, password);
    if (data && data.success) {
      setUser(data.user);
      if (data.user.role === "Admin") {
        navigate("/admin");
        return;
      } else {
        navigate("/");
        return;
      }
    } else {
      setErrorMessage(data ? data.message : "Login failed");
    }
  }

  return (
    <div className="container-fluid d-flex  align-items-center">
      <div className="col-4 offset-4 mt-5 p-4 border rounded d-flex flex-column">
        <h1>Login</h1>
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
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button variant="primary" type="submit">
            Login
          </Button>

          <Link to="/register" className="ms-3 btn btn-success">
            Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
