import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Col, Row, Form, InputGroup } from "react-bootstrap";
import { useState, useEffect, React } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./newpage.css";

const TypeDropDown = (props) => {
  const { type, changeType, index } = props;
  const all = ["Paragrafo", "Header", "Immagine"];
  const filteredArray = all.filter((item) => !item.startsWith(type));
  return (
    <Form.Select
      className="custom-change-button"
      onChange={(e) =>
        changeType(index, filteredArray[event.target.selectedIndex - 1])
      }
      value={type}
    >
      <option>{type}</option>
      <option value="1">{filteredArray[0]}</option>
      <option value="2">{filteredArray[1]}</option>
    </Form.Select>
  );
};

const Content = (props) => {
  const {
    type,
    content,
    changeContent,
    index,
    changeType,
    setBlockCheck,
    blockCheck,
    paragraphImagineCheck,
    headerCheck,
    setHeaderCheck,
    setParagraphImagineCheck,
    images
  } = props;
  
  const performImage = (images) => {
      return images.map((image, index) => {
        return (
          <option key={index} value={"http://localhost:3001/static/"+image.name}>{image.name.replace(/\.jpg$/, "")}</option>
        );
      });
  };

  const paragraph = (
    <Form.Group className="custom-textarea " style={{ position: "relative" }}>
      <Form.Label className="d-flex flex-row">
        <TypeDropDown
          type={"Paragrafo"}
          changeType={changeType}
          index={index}
        />
      </Form.Label>
      <Form.Control
        as="textarea"
        placeholder="paragrafo..."
        value={content}
        isInvalid={!!blockCheck[index]}
        onChange={(event) => {
          changeContent(index, event.target.value);
          blockCheck[index] = "";
          const newBlockCheck = [...blockCheck];
          setBlockCheck(newBlockCheck);
          setParagraphImagineCheck("");
        }}
        required
      />
      <Form.Control.Feedback type="invalid">
        {blockCheck[index]}
      </Form.Control.Feedback>
      {paragraphImagineCheck ? (
        <p style={{ color: "#DC3545", fontSize: "14px" }}>
          {paragraphImagineCheck}
        </p>
      ) : (
        ""
      )}
    </Form.Group> 
  );
  const header = (
    <Form.Group className="custom-header">
      <Form.Label className="d-flex flex-row">
        <TypeDropDown type={"Header"} changeType={changeType} index={index} />
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Header..."
        value={content}
        isInvalid={!!blockCheck[index]}
        onChange={(event) => {
          changeContent(index, event.target.value);
          blockCheck[index] = "";
          const newBlockCheck = [...blockCheck];
          setBlockCheck(newBlockCheck);
          setHeaderCheck("");
        }}
        required
      />
      <Form.Control.Feedback type="invalid">
        {blockCheck[index]}
      </Form.Control.Feedback>
      {headerCheck ? (
        <p style={{ color: "#DC3545", fontSize: "14px" }}>{headerCheck}</p>
      ) : (
        ""
      )}
    </Form.Group>
  );
  const image = (
    <Form.Group className="custom-imagine">
      <Form.Label className="d-flex flex-row">
        <TypeDropDown type={"Immagine"} changeType={changeType} index={index} />
      </Form.Label>
      <Form.Select
        aria-label="Default select example"
        className="custom-select"
        value={content}
        onChange={(event) => {
          changeContent(index, event.target.value);
          blockCheck[index] = "";
          const newBlockCheck = [...blockCheck];
          setBlockCheck(newBlockCheck);
          setParagraphImagineCheck("");
        }}
        required
      >
        <option value = "">Seleziona un'immagine</option>
        {performImage(images)}
      </Form.Select>
      {blockCheck[index] ? (
        <p style={{ color: "#DC3545", fontSize: "14px" }}>
          {blockCheck[index]}
        </p>
      ) : (
        ""
      )}
      {paragraphImagineCheck ? (
        <p style={{ color: "#DC3545", fontSize: "14px" }}>
          {paragraphImagineCheck}
        </p>
      ) : (
        ""
      )}
    </Form.Group>
  );
  let result;
  switch (type) {
    case "paragrafo":
      result = paragraph;
      break;
    case "header":
      result = header;
      break;
    case "immagine":
      result = image;
      break;
  }
  return result;
};

export default Content;
