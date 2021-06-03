import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import {NavBar} from "./components/generalComponents/NavBar";
import {Loader} from "./components/generalComponents/Loader";


function App() {

    const { login, logout, token, userId, userRole, ready } = useAuth();

    const isAuthenticated = !!token;

    const routes = useRoutes(isAuthenticated,userRole);

    if (!ready) {
        return <Loader/>;
    }

  return (
      <AuthContext.Provider value={ {login, logout, token, userId, isAuthenticated, userRole} }>
              <BrowserRouter>
                  <NavBar userRole={userRole} isAutenticated={isAuthenticated}/>
                  <div>
                      {routes}
                  </div>
              </BrowserRouter>
      </AuthContext.Provider>
  );
}

export default App;
