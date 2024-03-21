import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button, Container, Col, Row, Form } from "react-bootstrap";
import { useState, useEffect, React } from 'react'
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import validator from "validator";
import './Login.css'


const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordValid, setPasswordValid] = useState("");
    const [errorLogin, setErrorLogin] = useState("");
    const [waiting, setWaiting] = useState(false);

    const doLogin = async (event) => {
      event.preventDefault();
      const trimmedUsername = username.trim();
      const errorEm = validator.isEmpty(trimmedUsername) ? "Inserire email" : (
        !validator.isEmail(trimmedUsername) ? "Email non valida" : ""
      );
      const errorPass = validator.isEmpty(password)  ? "Inserire password" : "";
      if(!errorPass && !errorEm){
        
        const credentials = {username: trimmedUsername, password};
        setWaiting(true);
         await props.login(credentials, () =>setWaiting(false)).then( () =>{
          
              navigate("/");
          })
          .catch((err) => { 
            setErrorLogin(err.messages);
          });
        }else{
          setEmailError(errorEm);
          setPasswordValid(errorPass);
        }
    };
    const navigate = useNavigate();
    
    return (
      <Container fluid className="vh-100 all-mon d-flex justify-content-center align-items-center flex-column">
        
        <h1>BrightPapers</h1>
        <h6>Accedi</h6>
        <Form noValidate  onSubmit={doLogin}>
                      
                      <Form.Group controlId='username'>
                          <Form.Control className="form-control-lg no-outline " type='email' autoFocus isInvalid={!!emailError}  placeholder='email'
                           value={username} onChange={(event) => {setUsername(event.target.value), setEmailError(""); setErrorLogin("");}} required/>
                          <Form.Control.Feedback type="invalid">
                              {emailError}
                          </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group controlId='password' className='mt-3'>
                          <Form.Control className="form-control-lg no-outline " type='password'  placeholder='password'  isInvalid={passwordValid} 
                            value={password} onChange={(event) =>{setPassword(event.target.value); setPasswordValid(""); setErrorLogin("");} } required/>
                          <Form.Control.Feedback type="invalid">
                              {passwordValid}
                          </Form.Control.Feedback>
                      </Form.Group>
                      
                      { errorLogin ?  <h6 style={{ color: '#ff4c4c' }}>{errorLogin}</h6> : <></>}
                      <Button className='my-2 custom-button-style button-size' type='submit'>{
                        waiting ? <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      /> : "accedi"
                      }</Button>
                      <Button className='my-2 mx-2 custom-back-button button-size'  onClick={()=>navigate('/')}>Indietro</Button>
        </Form>
        
      </Container>
    );
};

export default Login;