import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Col, Row, Form, Card } from "react-bootstrap";
import { useState, useContext, React, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./newpage.css";
import Content from "./Content";
import validator from "validator";
import dayjs from "dayjs";
import API from "../API";
import { AuthContext } from "../AuthContext";

const ShowPage = (props) => {
  const { pageId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  let pageContent = "";
  useEffect(() => {
    API.showPage(pageId)
      .then((page) => {
        setTitle(page.title);
        setDate(page.date);
        setBlocks(page.blocks);
        setAuthor(page.author);
      })
      .catch((err) => {
        navigate("/");
        throw err;
      });
  }, []);

  const render = (blocks) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case "paragrafo":
          return <Card.Text key={index}>{block.content}</Card.Text>;
        case "header":
          return (
            <Card.Title key={index}>
              <h3>{block.content}</h3>
            </Card.Title>
          );
        case "immagine":
          return <Card.Img key={index} src={block.content} />;
        default:
          return null;
      }
    });
  };

  const howManyDay = (date) => {
    const today = dayjs();
    const insert = dayjs(date);
    if (today.diff(insert, "day") < 0)
      return today.diff(insert, "day") + " giorni alla pubblicazione";
    return today.diff(insert, "day") + " giorni fa";
  };
  const navigate = useNavigate();
  return (
    <>
      <Button
        className="my-2 mx-2 custom-button-style button-size"
        onClick={() => navigate("/")}
      >
        <i className="bi bi-house" />
      </Button>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>
            <h1>{title}</h1>
          </Card.Title>
          {render(blocks)}
          <Card.Title>
            {" "}
            <h6>Autore: {author}</h6>{" "}
          </Card.Title>
        </Card.Body>
        <Card.Footer className="text-muted">{howManyDay(date)}</Card.Footer>
      </Card>
    </>
  );
};

export default ShowPage;
