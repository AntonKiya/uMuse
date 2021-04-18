import React, {useRef, useContext} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";

export const ProfileDataS = ({getProfileData, dataProfile}) => {

    const {request} = useHttp();

    const fileInput = useRef(null);

    const authContext = useContext(AuthContext);

    const send = async () => {
        try {

            const data = new FormData();

            const image = fileInput.current.files[0];

            data.append('image', image);

            await request('/api/add/photo', 'POST', data,
                {
                    'Authorization': `Bearer ${authContext.token}`,
                    'type': 'formData',
                });

            getProfileData();

        }catch (e){}
    };

    return(
        <div>
            <img style={{"display":"inline-block", "borderRadius":"5px", "width":"300px", "height":"300px"}} src={`http://localhost:5000/api/user/getPhoto/${dataProfile.photoStudent}`}/>
            <button onClick={send}>Обновить</button>

            <input ref={fileInput} style={{"display":"inline-block", "borderRadius":"5px", "width":"300px", "height":"300px"}} type="file"/>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{dataProfile.id_student}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{dataProfile.nameStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{dataProfile.emailStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город: <span style={{'color':'#03a9f4'}}>{dataProfile.city}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Контакт для связи: <span style={{'color':'#03a9f4'}}>{dataProfile.connectStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы:
                {
                    dataProfile.interests.map((item) => {
                        return(
                            <div style={{'display':'inline-block','backgroundColor':'red', 'padding':'5px', 'marginLeft':'3px'}}>{item.interest}</div>
                        )
                    })
                }
            </h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{dataProfile.ageStudent} лет</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О вас: <span style={{'color':'#03a9f4'}}>{dataProfile.aboutStudent}</span></h5>
            <Link to={'/editS'}><button className="btn blue" >Редактировать</button></Link>
        </div>
    );
};
