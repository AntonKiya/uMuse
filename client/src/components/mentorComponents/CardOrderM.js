import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from '../../socket-io-client';



export const CardOrderM = ({orders}) => {

    const {request, loadind, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [liked, setLiked] = useState([...orders]);

    useEffect(() => {
        console.log(orders);
    })

    const [responses, setResponses] = useState([]);

    const [hidden, setHidden] = useState([]);

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`});

        alert(status.id_order);

        setResponses([...responses, status.id_order]);

        await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const unrespond = async (orderId) => {

        const status = await request('/api/uninviting/uninvitingMentor', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`});

        alert(status.order_id)

        setHidden([...hidden, status.order_id]);

        // await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const insert = async (orderId, index) => {

        await request('/api/liked/mentorLiked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = true]);

    }

    const deleted = async (orderId, index) => {

        await request('/api/liked/mentorUnliked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = false]);

    }

    return(
        <div className={'center'}>
            }
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Подходящие вас заявки😋🤝</h3>
            <div>
                {
                    orders.map((item, index)=> {
                        return (
                            <div style={ hidden.indexOf(item.id_order || item.order_id) !== -1 && {'display':'none'} || {'display':'block'} } className="col s12 m7" key={item.id_order || item.order_id}>
                                {liked[index].liked && <h3 onClick={() => deleted(item.id_order || item.order_id, index)} style={{'color':'black'}}>❤️</h3> || <h3 onClick={() => insert(item.id_order || item.order_id, index)} style={{'color':'black'}}>🤍</h3>}
                                <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                    <h2 className="header">{index} and {liked[index].liked}</h2>
                                    <h2 className="header">{item.direction}</h2>
                                </Link>
                                <div className="card horizontal">
                                    <div className="card-stacked">
                                        <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                            <div className="card-content">
                                                <p>{item.suggestions}</p>
                                                <p>Была создана {item.datetime}</p>
                                            </div>
                                        </Link>
                                        <div className="card-action">
                                            {
                                                item.invited === 'true' && <Link to={`/chat/${item.id_response}`}><button className={'btn green'}>Чат</button></Link>
                                                ||
                                                ( item.id_response || responses.indexOf(item.id_order || item.order_id) !== -1 ) && <p>Вы откликнулись на данную заявку</p>
                                                ||
                                                <div>
                                                    <button
                                                        onClick={ () => respond(item.order_id || item.id_order) }
                                                        disabled={loadind}
                                                        type="button"
                                                        className={'btn orange'}
                                                    >
                                                        Откликнуться
                                                    </button>
                                                    <button
                                                        onClick={ () => unrespond(item.order_id || item.id_order) }
                                                        disabled={loadind}
                                                        type="button"
                                                        className={'btn red'}
                                                    >
                                                        Не интересно
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                        <h5 style={{'color':'#f4033b'}}>
                                        {
                                            item.invited === 'true' && <Link to={`/viewProfstudent/${item.id_order || item.order_id}/${item.student_id}`}>{item.email}</Link>
                                            ||
                                            item.invited === 'reject' && 'Вам отказали, но не расстраивайтесь🤕'
                                            ||
                                            item.invited === 'null' && ' Контактов пока нет'
                                        }
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
