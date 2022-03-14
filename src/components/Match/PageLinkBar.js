import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export function PageLinkBar({ slug }) {
  return (
    <Nav className="page-bar justify-content-center">
      <LinkContainer to={`/stats/${slug}`}>
        <Nav.Link>Stats</Nav.Link>
      </LinkContainer>
      <LinkContainer to={`/predictions/${slug}`}>
        <Nav.Link>Predictions</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}
