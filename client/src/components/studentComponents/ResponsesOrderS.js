import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";


export const ResponsesOrderS = ({responses}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const {idOrder} = useParams();

    const [liked, setLiked] = useState([...responses]);

    const [hidden, setHidden] = useState([]);

    const [invited, setInvited] = useState([]);

    const invite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, idResponse, mentorId},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setInvited([...invited, status.mentor_id]);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse,orderId: idOrder,noticeType: 'invite'});


        }catch (e){}
    };

    const uninvite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/uninviting/uninvitingStudent',
                'POST',
                {orderId: idOrder, mentorId},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setHidden([...hidden, +status.mentor_id]);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'uninvite'});


        }catch (e){}
    }

    const insert = async (mentorId, index) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = true]);

    }

    const deleted = async (mentorId, index) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = false]);

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            {
                responses.map((item, index) => {
                    return(
                        <div style={ hidden.indexOf(item.id_mentor) !== -1 && {'display':'none'} || {'display':'block'}} key={item.id_order}>
                            <div className="card horizontal">
                                <p>Сука {item.id_order}</p>
                                <div className="card-stacked">
                                    {liked[index].liked && <h3 onClick={() => deleted(item.id_mentor || item.mentor_id, index)} style={{'color':'black'}}>❤️</h3> || <h3 onClick={() => insert(item.id_mentor || item.mentor_id, index)} style={{'color':'black'}}>🤍</h3>}
                                    <Link to={`/viewProfmentor/${idOrder}/${item.id_mentor}`}>
                                        <div className="card-content">
                                            <h4 className="header">{item.direction}</h4>
                                            <h5>
                                                <img style={{"display":"inline-block", "borderRadius":"5px", "width":"30px", "height":"30px"}} src={`http://localhost:5000/api/user/getPhoto/${item.photoMentor}`}/>
                                                {item.nameMentor}
                                            </h5>
                                            <p>{item.city}</p>
                                            <p>{item.experience} опыт</p>
                                        </div>
                                    </Link>
                                    {/*<div className="card-action">*/}
                                    {/*    <button onClick={() => invite(item.id_mentor)} disabled={loading} className={'btn orange'}>Пригласить</button>*/}
                                    {/*    <button className={'btn red'}>Отказать</button>*/}
                                    {/*</div>*/}
                                    {
                                        (item.invited === 'true'
                                        ||
                                        invited.indexOf(item.id_mentor) !== -1
                                        )
                                        &&
                                        <div>
                                            <p>Ментор приглашен</p>
                                            <Link to={`/chat/${item.id_response}`}><button className={'btn green'}>Чат</button></Link>
                                        </div>
                                        ||
                                        <div className="card-action">
                                            <button onClick={() => invite({mentorId: item.id_mentor, idResponse: item.id_response})} disabled={loading} className={'btn orange'}>Пригласить</button>
                                            <button onClick={() => uninvite({mentorId: item.id_mentor, idResponse: item.id_response})} className={'btn red'}>Отказать</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
