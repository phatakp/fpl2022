import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MotionDiv } from "../MotionDiv";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const formSubmit = async (e) => {
    e.preventDefault();
    const resp = await login(email, password);
    if (resp.status === 200) {
      navigate("/dashboard");
    } else {
      setError("Invalid login credentials");
    }
  };

  return (
    <MotionDiv type="slideRight">
      <Form className="sign-in-form" autoComplete="off" onSubmit={formSubmit}>
        <h2 className="form-title">Login</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <FloatingLabel className="input-field" controlId="email" label="Email">
          <Form.Control
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="password"
          label="Password"
        >
          <Form.Control
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </FloatingLabel>

        <Button className="form-button" type="submit">
          Submit
        </Button>
      </Form>
    </MotionDiv>
  );
}
