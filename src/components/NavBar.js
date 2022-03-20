import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { ChangePassword } from ".";
import { useModal } from "../hooks";
import { useAuth } from "../hooks/useAuth";
import { UpdateProfile } from "./Account/UpdateProfile";

export function NavBar() {
  const navigate = useNavigate();
  const { state: user, name, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const { setShow, modal } = useModal(<ChangePassword />, "Change Password");
  const { setShow: setProfileShow, modal: profileModal } = useModal(
    <UpdateProfile user={user} />,
    "Update Profile"
  );

  return (
    <Navbar className="topnav" expand="lg" bg="dark">
      <Container fluid>
        {modal}
        {profileModal}
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
                  <NavDropdown.Item onClick={() => setShow(true)}>
                    Change Password
                  </NavDropdown.Item>

                  <NavDropdown.Item onClick={() => setProfileShow(true)}>
                    Update Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

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
