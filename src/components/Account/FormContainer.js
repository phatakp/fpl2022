import React from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function FormContainer({ page }) {
  return (
    <div className="form-container">
      <div className="form-div">{getForm(page)}</div>
    </div>
  );
}

function getForm(page) {
  switch (page) {
    case "Register":
      return <RegisterForm />;
    case "Login":
      return <LoginForm />;
    default:
      return null;
  }
}
