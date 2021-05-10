import React, {useRef, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {State} from '../../State';
import io from '../../socket-io-client';
import socket from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";

export const ProfileDataS = ({getProfileData, dataProfile}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const fileInput = useRef(null);

    const authContext = useContext(AuthContext);

    const {state, dispatch} = State();

    useEffect(() => {

        io.emit('GET_NOTICES', {
            userId: authContext.userId,
            userRole: authContext.userRole
        });

        io.on('SET_NOTICE', (data) => {

            dispatch({
                type: 'SET_NOTICE',
                payload: data
            })
        });

    }, []);

    const deleteNotice = async (id_notice) => {

        await io.emit('DELETE_NOTICE', {
            userId: authContext.userId,
            userRole: authContext.userRole,
            id_notice: id_notice,
        });

    };

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
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div>
                {
                    state.notices.map((item) => {
                        return(
                            item.noticeType === 'response' && <div onClick={() => deleteNotice(item.id_noticeStudent)}><Link to={`/allResp/${item.data}`}><p>{item.id_noticeStudent} У вас новый отклик № {item.data}</p></Link><button onClick={() => deleteNotice(item.id_noticeStudent)} >Понятно</button></div>
                            ||
                            item.noticeType === 'message' && <div onClick={() => deleteNotice(item.id_noticeStudent)}><Link to={`/chat/${item.data}`}><p>{item.id_noticeStudent} У вас новое сообщение {item.data}</p></Link><button onClick={() => deleteNotice(item.id_noticeStudent)} >Понятно</button></div>
                        );
                    })
                }
            </div>
            <img style={{"display":"inline-block", "borderRadius":"5px", "width":"200px", "height":"200px"}} src={`http://localhost:5000/api/user/getPhoto/${dataProfile.photoStudent}`}/>
            <button onClick={send}>Обновить</button>
            <input ref={fileInput} style={{"display":"inline-block", "borderRadius":"5px"}} type="file"/>
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
