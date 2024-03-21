import { React, useContext, useState } from "react";
import "./nav.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavItem, Button, Container } from "react-bootstrap";
import { NavLink, Outlet, Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import validator from "validator";
import { AuthContext } from "../AuthContext";
import Modal from "react-bootstrap/Modal";
import API from "../API";
import Form from "react-bootstrap/Form";
const NavbarWithLogin = (props) => {
  const { user, loggedIn } = useContext(AuthContext);
  const { nameCMS, setNameCMS, doLogOut } = props;
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupCheck, setShowPopupCheck] = useState("");
  const changeName = (event) => {
    event.preventDefault();
    const errorName = validator.isEmpty(nameCMS) ? "Inserire un nome" : "";
    setShowPopupCheck(errorName);
    if (!errorName) {
      const toback = { nameCMS };
      API.changeCMS(toback)
        .then(() => {
          setShowPopup(false);
        })
        .catch((err) => {
          console.log("err:", err);
          throw err;
        });
    }
  };
  return (
    <>
      <Navbar
        className="navbar-padding d-flex justify-content-between align-items-center background-color"
        fixed="top"
      >
        {" "}
        {/*expand="sm"*/}
        <Navbar.Brand>
          <Nav.Link className="sizing d-flex flex-row align-items-center">
            <img src="/logo3.png" alt="" />
            <h2> | {nameCMS}</h2>
          </Nav.Link>
        </Navbar.Brand>
        <Nav className="align-items-center">
          {!loggedIn ? (
            <>
              <Nav.Item className="ml-md-auto mx-4">
                <NavLink to="/login" className="text-color">
                  Accedi
                </NavLink>
              </Nav.Item>
            </>
          ) : (
            <Nav.Item className="ml-md-auto ">
              <Dropdown className="mx-4">
                <Dropdown.Toggle
                  className="custom-logged-button no-border-dropdown"
                  variant="success"
                >
                  {user.type === 0 ? (
                    <>Ciao {user.name}</>
                  ) : (
                    <>Amministratore {user.name}</>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="list-dropdown">
                  <Dropdown.Item
                    className="signle-element"
                    as={Link}
                    to="/newpage"
                  >
                    Nuova Pagina
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="signle-element"
                    as={Link}
                    to="/mypages"
                  >
                    Mie pagine
                  </Dropdown.Item>
                  {user.type === 1 ? (
                    <Dropdown.Item
                      className="signle-element"
                      onClick={() => setShowPopup(true)}
                    >
                      Cambia nome
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}
                  <Dropdown.Item className="signle-element" onClick={doLogOut}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          )}
        </Nav>
        <Modal show={showPopup} onHide={() => setShowPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cambia nome</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={changeName}>
              <Form.Group className=" mb-3 custom-text ">
                <Form.Label className="d-flex flex-row">Nuovo nome:</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                  isInvalid={!!showPopupCheck}
                  value={nameCMS}
                  onChange={(event) => {
                    setNameCMS(event.target.value), setShowPopupCheck("");
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {showPopupCheck}
                </Form.Control.Feedback>
              </Form.Group>
              <Button className="my-2 custom-button-style " type="submit">
                Modifica
              </Button>
              <Button
                className="mx-2  custom-back-button button-size"
                onClick={() => setShowPopup(false)}
              >
                Annulla
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Navbar>
      <Container className="all-mon below-nav">
        <Outlet />
      </Container>
    </>
  );
};
export default NavbarWithLogin;
