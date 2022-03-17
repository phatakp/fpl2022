import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function NavBar() {
  const navigate = useNavigate();
  const { name, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar className="topnav" expand="lg" bg="dark">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>
            <Image
              className="logo"
              src={`${process.env.REACT_APP_STATIC_URL}/ipl-logo.png`}
              fluid
            />
            <h4>2022</h4>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="top-nav">
          <FaBars className="fabars" />
          <FaTimes className="fatimes" />
        </Navbar.Toggle>

        <Navbar.Collapse id="top-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/game-rules">
              <Nav.Link>Rules</Nav.Link>
            </LinkContainer>

            <NavDropdown title="Matches" id="matches-dropdown">
              <LinkContainer to="/fixtures">
                <NavDropdown.Item>Fixtures</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/results">
                <NavDropdown.Item>Results</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            {name ? (
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
                <NavDropdown title={name} id="profile-dropdown">
                  <LinkContainer to="/chg-password">
                    <NavDropdown.Item>Change Password</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
