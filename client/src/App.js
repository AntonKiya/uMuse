import React from 'react';
import {BrowserRouter} from "react-router-dom";
import 'materialize-css';
import {useRoutes} from "./routes";


function App() {

    const routes = useRoutes(false);

  return (
      <div>
        <h1 className={"container"}>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </h1>
      </div>
  );
}

export default App;
