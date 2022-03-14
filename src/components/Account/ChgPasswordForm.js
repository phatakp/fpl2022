import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { MotionDiv } from "../MotionDiv";

export function ChgPasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");

  const formSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      setError("The two password fields didn't match");
      return;
    }
    console.log(oldPassword, newPassword, newPassword2);
  };

  return (
    <MotionDiv type="slideRight">
      <Form className="chg-pwd-form" autoComplete="off" onSubmit={formSubmit}>
        <h2 className="form-title">Change Password</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <FloatingLabel
          className="input-field"
          controlId="oldpwd"
          label="Old Password"
        >
          <Form.Control
            type="password"
            name="oldPassword"
            value={oldPassword}
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
            required
            minLength={8}
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="newpwd"
          label="New Password"
        >
          <Form.Control
            type="password"
            name="newPassword"
            value={newPassword}
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </FloatingLabel>

        <FloatingLabel
          className="input-field"
          controlId="newpwd2"
          label="Confirm New Password"
        >
          <Form.Control
            type="password"
            name="newPassword2"
            value={newPassword2}
            placeholder="New Password2"
            onChange={(e) => setNewPassword2(e.target.value)}
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
