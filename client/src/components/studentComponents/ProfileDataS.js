import React from 'react';
import {Link} from "react-router-dom";

export const ProfileDataS = ({dataProfile}) => {


    return(
        <div>
            <img src={`http://localhost:5000/api/user/getPhoto/${dataProfile.photo}`}/>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{dataProfile.id_student}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{dataProfile.nameStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{dataProfile.emailStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{dataProfile.ageStudent} лет</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О вас: <span style={{'color':'#03a9f4'}}>{dataProfile.aboutStudent}</span></h5>
            <Link to={'/editS'}><button className="btn blue" >Редактировать</button></Link>
        </div>
    );
};
