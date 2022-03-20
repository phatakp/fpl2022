import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { resetPassword, validateEmail } from "../../api";

export function ResetPassword() {
  const [page, setPage] = useState(1);
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (page === 1) {
      try {
        const resp = await validateEmail(email);
        if (resp.status === 200) {
          setId(resp.data.id);
          setPage((page) => page + 1);
        } else setError("Email not registered");
      } catch (error) {
        console.log(error.response.data);
        setError("Email not registered");
      }
    }

    if (page > 1) {
      if (password !== password2) {
        setError("Two Passwords don't match");
        return;
      }

      try {
        await resetPassword(id, email, password, password2);
        setMessage("Password Updated. Please login");
      } catch (error) {
        const { non_field_errors } = error?.response?.data;
        if (non_field_errors) setError(non_field_errors);
      }
    }
  };

  return (
    <Form className="resetpwd-form" onSubmit={handleSubmit}>
      {(error || message) && (
        <Alert variant={error ? "danger" : "success"} className="text-center">
          {message ? message : error ? error : ""}
        </Alert>
      )}

      {page === 1 && (
        <Form.Group className="input mb-3" controlId="email">
          <Form.Label>Registered Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            required
            aria-required="true"
          ></Form.Control>
        </Form.Group>
      )}

      {page > 1 && (
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
      )}

      {page > 1 && (
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
      )}

      <Button type="submit">Submit</Button>
    </Form>
  );
}
