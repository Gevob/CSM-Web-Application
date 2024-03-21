import { useState, useEffect, React, useContext } from "react";
import reactLogo from "./assets/react.svg";
import { Container, Row, Col, Button } from "react-bootstrap/";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarWithLogin from "./components/Navbar";
import FrontPage from "./components/Frontpage";
import Login from "./components/Login";
import Mypages from "./components/MyPages";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import "./App.css";
import API from "./API";
import { AuthContextProvider, AuthContext } from "./AuthContext";
import Spinner from "react-bootstrap/Spinner";
import NewPage from "./components/NewPage";
import EditPage from "./components/Edit";
import ShowPage from "./components/ShowPage";
import Office from "./components/Office";
function App() {
  const { user, loggedIn, setUser, setLoggedIn, go } = useContext(AuthContext);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [errorLogin, setErrorLogin] = useState("");
  const [nameCMS, setNameCMS] = useState("");
  const doLogin = async (credentials, endOperation) => {
    await API.logIn(credentials)
      .then((user) => {
        setUser(user);
        setLoggedIn(true);
      })
      .catch((err) => {
        throw err;
      })
      .finally(endOperation?.());
  };

  const doLogOut = async () => {
    API.logOut()
      .then(() => {
        setUser(undefined);
        setLoggedIn(false);
      })
      .catch((err) => {
        setErrors(err.filter((e) => e !== "Not authenticated"));
      });
  };

  useEffect(() => {
    if (go) {
      setLoading(false);
    }
  }, [go]);

  useEffect(() => {
    API.loadCMS()
      .then((name) => {
        setNameCMS(name[0].nome);
      })
      .catch((err) => {
        throw err;
      });
  }, []);


  function NotFoundPage() {
    return (
      <>
        <div style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h1>
            <i className="bi bi-exclamation-circle-fill" /> The page cannot be
            found <i className="bi bi-exclamation-circle-fill" />
          </h1>
          <br />
          <p>
            The requested page does not exist, please head back to the{" "}
            <Link to={"/"}>app</Link>.
          </p>
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Container fluid className=" size background-color vh-100">
        <Routes>
          <Route
            path="/"
            element={
              <NavbarWithLogin
                nameCMS={nameCMS}
                setNameCMS={setNameCMS}
                doLogOut={doLogOut}
              />
            }
          >
            <Route
              index
              element={
                loading ? (
                  <Spinner animation="border" />
                ) : loggedIn ? (
                  <Office logged={true} pages={pages} />
                ) : (
                  <Office logged={false} pages={pages} />
                )
              }
            />
            <Route
              path="newpage"
              element={
                loading ? (
                  <Spinner animation="border" />
                ) : loggedIn ? (
                  <NewPage />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
            <Route
              path="mypages"
              element={
                loading ? (
                  <Spinner animation="border" />
                ) : loggedIn ? (
                  <Mypages />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
            <Route
              path="edit/:pageId"
              element={
                loading ? (
                  <Spinner animation="border" />
                ) : loggedIn ? (
                  <EditPage />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
            <Route path="page/:pageId" element={<ShowPage />} />
          </Route>
          <Route path="/login" element={<Login login={doLogin} />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
export default App;
