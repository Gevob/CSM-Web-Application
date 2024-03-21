import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Col, Row, Form, InputGroup } from "react-bootstrap";
import { useState, useContext, React, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import "./mypages.css";
import Content from "./Content";
import validator from "validator";
import dayjs from "dayjs";
import API from "../API";
import Card from 'react-bootstrap/Card';
import { AuthContext } from "../AuthContext";


const MyPages = (props) => {
  const { user } = useContext(AuthContext);
  const [pages, setPages] = useState([]);
  useEffect(() => {
    API.getMyPages()
      .then((pages) => {
        setPages(pages);
      })
      .catch((err) => {
        throw err;
      });
  }, []);
  const navigate = useNavigate();

  const deletePage = (idPage,index) => {
    API.deletePage(idPage).then(() => {
      const updatedPages = [...pages];
      
      updatedPages.splice(index, 1);
    
      setPages(updatedPages);
    }).catch((err) => {
      throw err;
    });
  };

  const editPage = (idPage) => {
    navigate("/edit/"+idPage);
  };

  return (
    <Container
      fluid
      className=" position-inherit pb-5"
    >
      <h4>Mie Pagine</h4>
      <Button className='my-2  custom-back-button button-size'  onClick={()=>navigate('/')}><i className="bi bi-house"/></Button>
      <Container fluid className=" justify-content-center align-items-center flex-column">
      <Row>
        {pages.map((page, index) => {
          return (
            <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                <Card  className="mb-3">
      <Card.Body>
        <Card.Title><h6 style={{ fontWeight: 'bold' }}>{page.title}</h6></Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{page.author}</Card.Subtitle>
        <Card.Text>
            Inserito nel sistema in data {page.publish}
        </Card.Text>
        <Card.Text>
            Pubblicato in data {page.date}
        </Card.Text>
        <Button className="custom-button-style" onClick={(e) => navigate("/page/"+page.idPages)} ><i className="bi bi-book"/></Button>
        <Button className="custom-add-button mx-3" onClick={(e) => editPage(page.idPages)} ><i className="bi bi-pencil-square"/></Button>
        <Button className="custom-add-button" onClick={(e) => deletePage(page.idPages,index)} ><i className="bi bi-trash3"/></Button>
      </Card.Body>
    </Card>    
    </Col>
          );
        })}
      </Row>
      </Container>
    </Container>
  );
};

export default MyPages;
