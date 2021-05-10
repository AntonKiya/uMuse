import React, {useRef, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {State} from "../../State";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";


export const ProfileDataM = ({getProfileData, dataProfile}) => {

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
                <div>
                    {
                        state.notices.map((item) => {
                            return(
                                item.noticeType === 'invite' && <div onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/viewProfappM/${item.data}`}><p>{item.id_noticeMentor} Вас пригласили № {item.data}</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                                ||
                                item.noticeType === 'uninvite' && <div onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/viewProfappM/${item.data}`}><p>{item.id_noticeMentor} Вам отказали № {item.data}</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                                ||
                                item.noticeType === 'message' && <div onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/chat/${item.data}`}><p>{item.id_noticeMentor} У вас новое сообщение {item.data}</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                            );
                        })
                    }
                </div>
                <img style={{"display":"inline-block", "borderRadius":"5px", "width":"200px", "height":"200px"}} src={`http://localhost:5000/api/user/getPhoto/${dataProfile.photoMentor}`} />
                <button onClick={send}>Обновить</button>

                <input ref={fileInput} style={{"display":"inline-block", "borderRadius":"5px"}} type="file"/>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{dataProfile.id_mentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{dataProfile.nameMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{dataProfile.emailMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Контакт для связи: <span style={{'color':'#03a9f4'}}>{dataProfile.connectMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город: <span style={{'color':'#03a9f4'}}>{dataProfile.city}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{dataProfile.ageMentor} лет</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О вас: <span style={{'color':'#03a9f4'}}>{dataProfile.aboutMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт: <span style={{'color':'#03a9f4'}}>{dataProfile.experience}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Образование: <span style={{'color':'#03a9f4'}}>{dataProfile.educationMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Муз направление: <span style={{'color':'#03a9f4'}}>{dataProfile.direction}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы:
                    {
                        dataProfile.interests.map((item, index, array) => {
                            return(
                                <div style={{'display':'inline-block','backgroundColor':'red', 'padding':'5px', 'marginLeft':'3px'}}>{item.interest}</div>
                            )
                        })
                    }
                </h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол: <span style={{'color':'#03a9f4'}}>{dataProfile.sex}</span></h5>
                <Link to={'/editM'}><button className="btn blue" >Редактировать</button></Link>
            </div>
        </div>
    );
};
