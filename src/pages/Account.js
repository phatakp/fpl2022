import { Container } from "react-bootstrap";
import { FormContainer, PanelContainer } from "../components";

export function Account({ page }) {
  return (
    <Container
      className={`auth-container ${page === "Register" ? "signup" : "signin"}`}
    >
      <PanelContainer page={page} />
      <FormContainer page={page} />
    </Container>
  );
}
