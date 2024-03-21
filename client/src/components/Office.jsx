import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Col, Row, Form, InputGroup } from "react-bootstrap";
import { useState, useContext, React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import "./mypages.css";
import Content from "./Content";
import validator from "validator";
import dayjs from "dayjs";
import API from "../API";
import Card from "react-bootstrap/Card";
import { AuthContext } from "../AuthContext";

const Office = (props) => {
  const { logged } = props;
  const [pages, setPages] = useState([]);
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState(false);
  const [pageShowed, setPageShowed] = useState([]);
  useEffect(() => {
      API.getAllPages()
        .then((pages) => {
          setPages(pages);
          setPageShowed(!logged ? changeShowedPage(pages) :pages);
          setFilter(!logged ? true : false);
        })
        .catch((err) => {
          
          throw err;
        });
        
  }, []);

  useEffect(()=>{
    if(!logged){
      const showed = changeShowedPage(pages);
      setPageShowed(showed);
      setFilter(true);
    }
  },[logged])

  const navigate = useNavigate();

  const howManyDay = (date) => {
    if (date === "") return "";
    const today = dayjs();
    const insert = dayjs(date);
    return today.diff(insert, "day");
  };
  const checkState = (date) => {
    if (howManyDay(date) === "") return "draft";
    if (howManyDay(date) < 0) return "programmata";
    if (howManyDay(date) >= 0) return "pubblicata";
  };

  const deletePage = (idPage, index) => {
    API.deletePage(idPage)
      .then(() => {
        const updatedPages = [...pageShowed];
        updatedPages.splice(index, 1);
        setPageShowed(updatedPages);
      })
      .catch((err) => {
        throw err;
      });
  };


  const changeShowedPage = (pages) => {
    const today = dayjs();
    return pages.filter((page) => page.date !== "").filter((page) => {
      const pageDate = dayjs(page.date);
      const diff = today.diff(pageDate, "day");
      return diff >= 0;
    });
  };

  const changeView = () => {
    if(!filter){
      const showed = changeShowedPage(pages);
      setPageShowed(showed);
    }else{
      const showed = [...pages];
      setPageShowed(showed);
    }
    setFilter(!filter);
  }

  const editPage = (idPage) => {
    navigate("/edit/" + idPage);
  };
  return (
    <Container fluid className=" position-inherit pb-5">
      <h4>{!filter ? "Back-office" : "Front-office"}</h4>
      {logged ? <Button
        className="my-2 mx-2 custom-button-style button-size"
        onClick={() => changeView()}
      >
        switch
      </Button> : <></>}
      <Container
        fluid
        className="justify-content-center align-items-center flex-column"
      >
        <Row className="d-flex align-items-stretch">
          {pageShowed.map((page, index) => {
            return (
              <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                <Card className="mb-3 h-100">
                  <Card.Body>
                    <Card.Title>
                      <h6 style={{ fontWeight: "bold" }}>{page.title}</h6>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {page.author}
                    </Card.Subtitle>
                    <Card.Text>
                      Inserito nel sistema in data {page.publish}
                    </Card.Text>
                    <Card.Text>Resa pubblica il {page.date}</Card.Text>
                    <Card.Text>Stato:{checkState(page.date)}</Card.Text>
                    <Button
                      className="custom-button-style"
                      onClick={(e) => navigate("/page/" + page.idPages)}
                    >
                      <i className="bi bi-book" />
                    </Button>
                    {logged && (page.idUser === user.id || user.type === 1) && !filter ? (
                      <>
                        <Button
                          className="custom-add-button mx-3"
                          onClick={(e) => editPage(page.idPages)}
                        >
                          <i className="bi bi-pencil-square" />
                        </Button>
                        <Button
                          className="custom-add-button"
                          onClick={(e) => deletePage(page.idPages, index)}
                        >
                          <i className="bi bi-trash3" />
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
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

export default Office;
