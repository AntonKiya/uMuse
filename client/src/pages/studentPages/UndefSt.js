import React from 'react';
import {Link} from "react-router-dom";


export const UndefSt = () => {


    return(
        <div>
            <h1>Page not found 404</h1>
            <Link to={'/myapps'}><h3>на главную</h3></Link>
        </div>
    )
}
