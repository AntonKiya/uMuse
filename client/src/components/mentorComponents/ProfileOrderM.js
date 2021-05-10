import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Link, useHistory} from "react-router-dom";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";



export const ProfileOrderM = ({order}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const [liked, setLiked] = useState({...order});

    const [response, setResponse] = useState(null);

    const history = useHistory();

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        setResponse(status.id_order);

        await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const unrespond = async (orderId) => {

        const status = await request('/api/uninviting/uninvitingMentor', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        if (status.order_id === orderId) history.push('/suitableapp');

        // await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const insert = async (orderId) => {

        await request('/api/liked/mentorLiked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: true});

    }

    const deleted = async (orderId) => {

        await request('/api/liked/mentorUnliked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: false});

    }

    return(
            <div className={'center'}>
                <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
                <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Заявка</h3>
                <div>
                    {liked.liked && <h3 onClick={() => deleted(order.id_order)} style={{'color':'black'}}>❤️</h3> || <h3 onClick={() => insert(order.id_order)} style={{'color':'black'}}>🤍</h3>}
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Уникальный номер заявки: <span style={{'color':'#03a9f4'}}>{order.id_order}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Музыкальное направление: <span style={{'color':'#03a9f4'}}>{order.direction}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт наставника: <span style={{'color':'#03a9f4'}}>{order.experience}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город: <span style={{'color':'#03a9f4'}}>{order.city}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол наставника: <span style={{'color':'#03a9f4'}}>{order.sex}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Тип занятий: <span style={{'color':'#03a9f4'}}>{order.type}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Цена от: <span style={{'color':'#03a9f4'}}>{order.price}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст от: <span style={{'color':'#03a9f4'}}>{order.ageFrom}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст до: <span style={{'color':'#03a9f4'}}>{order.ageTo}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пожелания к заявке: <span style={{'color':'#03a9f4'}}>{order.suggestions}</span></h5>
                    <p>Была создана {order.datetime}</p>
                    <h5 style={{'color':'#a62bdb', 'fontWeight': 'bold'}}>
                        <span style={{'color':'#f4033b'}}>
                            {
                                order.invited === 'true' && <Link to={`/viewProfstudent/${order.id_order}/${order.student_id}`}>{order.email}</Link>
                                ||
                                order.invited === 'reject' && 'Вам отказали, но не расстраивайтесь🤕'
                                ||
                                order.invited === 'null' && ' Контактов пока нет'
                            }
                        </span>
                    </h5>
                </div>
                {
                    order.invited === 'true' && <Link to={`/chat/${order.id_response}`}><button className={'btn green'}>Чат</button></Link>
                    ||
                    (order.id_response || response) && <p>Вы откликнулись на данную заявку</p>
                    ||
                    <div>
                        <button
                            onClick={() => respond(order.id_order)}
                            disabled={loading}
                            className="waves-effect waves-light btn blue"
                        >
                            Откликнуться
                        </button>
                        <button
                            onClick={() => unrespond(order.id_order)}
                            disabled={loading}
                            className="waves-effect waves-light btn red"
                        >
                            Не интересно
                        </button>
                    </div>
                }
            </div>
    );
};
