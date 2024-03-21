import React, { createContext, useState, useEffect } from "react";
import API from "./API";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
     API.isLogged().then((user) => {
        if (!user){ 
          setGo(true);
          return;
        }
        
        setUser(user);
        setLoggedIn(true);
        setGo(true);
      }).catch( (err ) => {
        setGo(true);
      });
    
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, setUser, setLoggedIn,go }}>
      {children}
    </AuthContext.Provider>
  );
};

export default { AuthContextProvider, AuthContext };
