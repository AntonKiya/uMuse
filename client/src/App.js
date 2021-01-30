import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css';
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";


function App() {

    const { login, logout, token, userId, userRole} = useAuth();

    const isAuthenticated = !!token;

    const routes = useRoutes(isAuthenticated,userRole);

  return (
      <AuthContext.Provider value={ {login, logout, token, userId, isAuthenticated, userRole} }>
          <div className={"container"}>
              <BrowserRouter>
                  {routes}
              </BrowserRouter>
          </div>
      </AuthContext.Provider>
  );
}

export default App;
