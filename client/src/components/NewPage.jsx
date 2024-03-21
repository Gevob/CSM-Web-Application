import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Col, Row, Form, InputGroup } from "react-bootstrap";
import { useState, useContext, React, useRef, useEffect } from "react";
import { useNavigate , Navigate } from "react-router-dom";
import "./newpage.css";
import Content from "./Content";
import validator from "validator";
import dayjs from 'dayjs';
import  API  from '../API'
import { AuthContext } from '../AuthContext';
const NewPage = (props) => {
  const { user, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const defaultInput = [
    {
      type: "header",
      content: "",
    },
    {
      type: "paragrafo",
      content: "",
    },
    {
      type: "immagine",
      content: "",
    },
  ];
  const [inputFields, setInputFields] = useState(defaultInput);
  const [headerCheck, setHeaderCheck] = useState("");
  const [paragraphImagineCheck, setParagraphImagineCheck] = useState("");
  const [titleCheck, setTitleCheck] = useState("");
  const [blockCheck, setBlockCheck] = useState(["", "", ""]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  useEffect(() => {
    API.getImages()
      .then((imagesServer) => {
        setImages(imagesServer);
        console.log("immagini arrivate dal server: ",imagesServer);
      })
      .catch((err) => {
        throw err;
      });
  }, []);
  /* drag & drop */
  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    let resetError = [...blockCheck];
    resetError = resetError.map((block, index) => {
      block = "";
      return block;
    });
    setBlockCheck(resetError);
    setHeaderCheck("");
    setParagraphImagineCheck("");
  };
  const drop = (e) => {
    const copyListItems = [...inputFields];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setInputFields(copyListItems);
  };
  /* ------------------------------------------------------ */
  const changeType = (index, ToType) => {
    let data = [...inputFields];
    const fromType = data[index].type;
    // verifico che la pagina rispetti ancora i requisiti
    if (makeTheChange(fromType, ToType.toLowerCase(), index)) {
      data[index].type = ToType.toLowerCase();
      setInputFields(data);
    }
  };

  const makeTheChange = (fromType, toType, index) => {
    let resetError = [...blockCheck];
    resetError = resetError.map((block, index) => {
      block = "";
      return block;
    });
    if (fromType === "header") {
      const headers = inputFields.filter((item) => item.type === "header");
      if (headers.length >= 2) {
        setBlockCheck(resetError);
        return true;
      } else {
        resetError[index] = "Ogni pagina deve avere almeno un header";
        setBlockCheck(resetError);
        return false;
      }
    } else {
      const paragraphOrImagine = inputFields.filter(
        (item) => item.type === "paragrafo" || item.type === "immagine"
      );
      if (paragraphOrImagine.length >= 2) {
        setBlockCheck(resetError);
        return true;
      } else if (toType === "paragrafo" || toType === "immagine") {
        setBlockCheck(resetError);
        return true;
      } else
        resetError[index] =
          "ogni pagina deve avere almeno un paragrafo o una immagine";
      setBlockCheck(resetError);
      return false;
    }
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };
  const addFields = () => {
    let newfield = { type: "paragrafo", content: "" };
    setInputFields([...inputFields, newfield]);
  };
  const deleteField = (index) => {
    const elementToDelete = inputFields[index].type;
    if (elementToDelete === "header") {
      const headers = inputFields.filter((item) => item.type === "header");
      if (headers.length >= 2) {
        deleteOperation(index);
      } else {
        setHeaderCheck("Ogni pagina deve avere almeno un header");
      }
    } else {
      const paragraphOrImagine = inputFields.filter(
        (item) => item.type === "paragrafo" || item.type === "immagine"
      );
      if (paragraphOrImagine.length >= 2) {
        deleteOperation(index);
      } else {
        setParagraphImagineCheck(
          "Ogni pagina deve avere almeno un paragrafo o immagine"
        );
      }
    }
  };

  const deleteOperation = (index) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };

  const changeContent = (index, content) => {
    let data = [...inputFields];
    data[index].content = content;
    console.log("new content added: ",content);
    setInputFields(data);
  };

  const insertPage = async (event) => {
    event.preventDefault();
    console.log(inputFields);
    const errorTitle = validator.isEmpty(title) ? "Inserire un titolo" : "";
    setTitleCheck(errorTitle);
    console.log("Controllo errore titolo", titleCheck);
    const inputCheck = [...blockCheck];
    inputFields.forEach((block, index) => {
      if (block.content === "")
        if (block.type === "paragrafo")
          inputCheck[index] = "Il paragrafo non può essere vuoto";
        else if (block.type === "header")
          inputCheck[index] = "L'header non può essere vuoto";
        else inputCheck[index] = "Selezionare un'immagine";
    });
    if(inputCheck.every( b => b === "")){
      console.log("Form da mandare al server: ",inputFields);
      console.log("Titolo: ",title);
      console.log("Data di pubblicazione: ",date);
      const author = user.name;
      if(date === "")
        setDate('');
        console.log("Data di pubblicazione: ",date);
      const page = {title,date,inputFields, author };
      console.log(page);
      await API.insertPage(page).then( (result) => {
        navigate("/page/"+result)
      }).catch(err => {
        
        throw err;});
    }else{
    setBlockCheck(inputCheck);
    }
  };
  return (
    
      
      <Container
      fluid
      className="d-flex justify-content-center flex-column new-page-container position-inherit pb-5">
      <h4>Crea una nuova pagina</h4>
      <Form noValidate onSubmit={insertPage}>
        <div className="d-flex justify-content-center">
          <Form.Group className=" mb-3 custom-text ">
            <Form.Label className="d-flex flex-row">Titolo:</Form.Label>
            <Form.Control
              type="text"
              required
              autoFocus
              isInvalid={!!titleCheck}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value), setTitleCheck("");
              }}
            />
            <Form.Control.Feedback type="invalid">
              {titleCheck}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className=" mb-3 custom-text ">
            <Form.Label className="d-flex flex-row">
              Data pubblicazione:
            </Form.Label>
            <Form.Control
              type="date"
              
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
              }}
            />
            
          </Form.Group>
        </div>
        <p>Trascina i blocchi per ordinare</p>
        <Container className="d-flex justify-content-center align-items-center flex-column">
          {inputFields.map((input, index) => {
            return (
              <div
                className="d-flex justify-content-center setdrag mb-3 resizable-container textarea"
                draggable
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                onDragOver={(e) => e.preventDefault()}
                key={index}
              >
                <Content
                  type={input.type}
                  content={input.content}
                  changeContent={changeContent}
                  index={index}
                  changeType={changeType}
                  setBlockCheck={setBlockCheck}
                  blockCheck={blockCheck}
                  paragraphImagineCheck={paragraphImagineCheck}
                  headerCheck={headerCheck}
                  setHeaderCheck={setHeaderCheck}
                  setParagraphImagineCheck={setParagraphImagineCheck}
                  images={images}
                />
                <Button
                  className="deleteButton"
                  onClick={(e) => deleteField(index)}
                >
                  <i className="bi bi-x customX" />
                </Button>
              </div>
            );
          })}
        </Container>
        <Button className="my-2 custom-button-style " type="submit">
          Crea Pagina
        </Button>
        <Button className="  mx-2 custom-add-button " onClick={addFields}>
          Aggiungi Blocco
        </Button>
        <Button className='my-2  custom-back-button button-size'  onClick={()=>navigate('/')}><i class="bi bi-house"/></Button>
      </Form>
    </Container>   
  );
};
export default NewPage;

{
  /*<InputGroup className="custom-textarea">
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup>*/
}
