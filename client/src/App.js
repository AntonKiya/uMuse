import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css';
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import {NavBarStudent} from "./components/studentComponents/NavBarStudent";
import {NavBarMentor} from "./components/mentorComponents/NavBarMentor";
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
                  {isAuthenticated && userRole === 'student' && <NavBarStudent/>}
                  {isAuthenticated && userRole === 'mentor' && <NavBarMentor/>}
                  <div className={"container"}>
                      {routes}
                  </div>
              </BrowserRouter>
      </AuthContext.Provider>
  );
}

export default App;
