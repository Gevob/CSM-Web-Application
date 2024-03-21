import React from "react";
import './nav.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Button, Container } from 'react-bootstrap/'
import "./front.css";
const FrontPage = () => {
  return (
    
    
      <Row className="custom-size h-100 overflow-hidden position-fixed">
        <Col
          md={6}
          xl={6}
          sm={6}
          className="d-flex align-items-center justify-content-center"
        >
          <h3 className="slide-from-left custom-banner">
            Sei una persona a cui piace condividere le tue idee?
            <br />
            Vorresti avere un blog? Scrivere degli articoli?
            <br />
            Ecco uno spazio fatto apposta per te. Entra nella{" "}
            <span style={{ color: "#49a078" }}>community!</span>
          </h3>
        </Col>
      </Row>
      
      
  );
};

export default FrontPage;