import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {NavLink, useHistory} from "react-router-dom";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";
import styles from "../../cssModules/componentsStyles/ProfileOrder.module.css";
import heartActive from "../../images/heartActive.svg";
import heartNotActive from "../../images/heartNotActive.svg";



export const ProfileOrderM = ({order}) => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const history = useHistory();

    const [liked, setLiked] = useState({...order});

    const [response, setResponse] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        setResponse(status.id_order);

        await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const unrespond = async (orderId) => {

        const status = await request('/api/uninviting/uninvitingMentor', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        if (status.order_id === orderId) history.push('/suitableapp');

    };

    const insert = async (orderId) => {

        await request('/api/liked/mentorLiked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: true});

    }

    const deleted = async (orderId) => {

        await request('/api/liked/mentorUnliked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: false});

    }

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
            <div className={styles.profileOrder}>
                <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
                <div className={styles.orderCard}>
                    <h1 className={styles.orderTitle}>Заявка</h1>
                    {liked.liked && <img className={styles.heart} src={heartActive} onClick={() => deleted(order.id_order)}/> || <img className={styles.heart} src={heartNotActive} onClick={() => insert(order.id_order)} />}
                    <div className={styles.orderContent}>
                        <h5 className={styles.contentItem} >Музыкальное направление: <span>{order.direction}</span></h5>
                        <h5 className={styles.contentItem} >Опыт : <span>{order.experience}</span></h5>
                        <h5 className={styles.contentItem} >Тип занятий: <span>{order.type}</span></h5>
                        <h5 className={styles.contentItem}>Описания заявки: <span >{order.suggestions || 'пусто'}</span></h5>
                        <h5 className={styles.contentItem} >Стоимость час: <span>{order.price}</span></h5>
                        <h5 className={styles.contentItem} >Пол: <span>{order.sex}</span></h5>
                        <h5 className={styles.contentItem} >Возраст: <span>{order.ageFrom} - {order.ageTo} лет</span></h5>
                        <h5 className={styles.contentItem} >Город: <span>{order.city}</span></h5>
                    </div>
                    <div className={styles.orderStatus}>
                        <div className={styles.actions}>
                            {
                                order.invited === 'true' && <NavLink to={`/chat/${order.id_response}`}><button className={styles.chatButton}>Чат</button></NavLink>
                                ||
                                (order.id_response || response) && <div>Вы откликнулись</div>
                                ||
                                <div>
                                    <button
                                        onClick={() => respond(order.id_order)}
                                        disabled={loading}
                                        className={styles.responseButton}
                                    >
                                        Откликнуться
                                    </button>
                                    <button
                                        onClick={() => unrespond(order.id_order)}
                                        disabled={loading}
                                        className={styles.uninvitingButton}
                                    >
                                        Не интересно
                                    </button>
                                </div>
                            }
                        </div>
                        <div className={styles.status}>
                            {
                                order.invited === 'true' && <NavLink className={styles.status} to={`/viewProfstudent/${order.id_order}/${order.student_id}`}>{order.email}</NavLink>
                                ||
                                order.invited === 'reject' && 'Вам отказали, но не расстраивайтесь🤕'
                                ||
                                order.invited === 'null' && ' Контактов пока нет'
                            }
                        </div>
                    </div>
                </div>
            </div>
    );
};
