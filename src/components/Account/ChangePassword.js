import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { changePassword } from "../../api";
import { useAuth } from "../../hooks";

export function ChangePassword() {
  const { getToken } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Two Passwords don't match");
      return;
    }

    try {
      const token = await getToken();
      await changePassword(token, oldPassword, password, password2);
      setMessage("Password Updated");
    } catch (error) {
      const { old_password, non_field_errors } = error?.response?.data;
      if (old_password) setError(old_password);
      else if (non_field_errors) setError(non_field_errors);
    }
  };

  return (
    <Form className="match-score-form" onSubmit={handleSubmit}>
      {(error || message) && (
        <Alert variant={error ? "danger" : "success"} className="text-center">
          {message ? message : error ? error : ""}
        </Alert>
      )}

      <Form.Group className="input mb-3" controlId="oldPassword">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          name="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
            setError("");
            setMessage("");
          }}
          minLength={8}
          required
          aria-required="true"
        ></Form.Control>
      </Form.Group>

      <Form.Group className="input mb-3" controlId="password">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
            setMessage("");
          }}
          minLength={8}
          required
          aria-required="true"
        ></Form.Control>
      </Form.Group>

      <Form.Group className="input mb-3" controlId="password2">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          name="password2"
          type="password"
          value={password2}
          onChange={(e) => {
            setPassword2(e.target.value);
            setError("");
            setMessage("");
          }}
        />
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
}
