import React, {useContext, useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from '../../socket-io-client';
import {Notification} from "../generalComponents/Notification";
import styles from '../../cssModules/componentsStyles/Order.module.css';
import heartActive from '../../images/heartActive.svg';
import heartNotActive from '../../images/heartNotActive.svg';
import {PageTitle} from "../generalComponents/PageTitle";


export const CardOrderM = ({orders, content}) => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const [liked, setLiked] = useState([...orders]);

    const [responses, setResponses] = useState([]);

    const [hidden, setHidden] = useState([]);

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`});

        setResponses([...responses, status.id_order]);

        await io.emit('NOTICE_MENTOR', {userId: authContext.userId, orderId: orderId, noticeType: 'response'});

    };

    const unrespond = async (orderId) => {

        const status = await request('/api/uninviting/uninvitingMentor', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`});

        setHidden([...hidden, status.order_id]);

    };

    const insert = async (orderId, index) => {

        await request('/api/liked/mentorLiked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = true]);

    }

    const deleted = async (orderId, index) => {

        await request('/api/liked/mentorUnliked', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = false]);

    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.cardOrder}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <PageTitle content={content}/>
            <div className={styles.cardsContainer}>
                {
                    orders.map((item, index)=> {
                        return (
                            <NavLink to={`/viewProfappM/${item.id_order || item.order_id}`} className={styles.orderCard} style={ hidden.indexOf(item.id_order || item.order_id) !== -1 && {'display':'none'} || {'display':'inline-block'} } key={item.id_order || item.order_id}>
                                <div className={styles.directionContainer}>
                                    <h2>{item.direction}</h2>
                                    <div className={styles.likedContainer} onClick={event => event.preventDefault()} >
                                        {liked[index].liked && <img src={heartActive} onClick={() => deleted(item.id_order || item.order_id, index)}/> || <img src={heartNotActive} onClick={() => insert(item.id_order || item.order_id, index)} />}
                                    </div>
                                </div>
                                <div className={styles.suggestions}>
                                    <p>{item.suggestions}</p>
                                </div>
                                <div className={styles.infoContainer}>
                                    <div className={styles.created}>была создана <p className={styles.datetime}>{item.datetime}</p></div>
                                    <div className={styles.statusContainer}>
                                        <div onClick={event => event.preventDefault()} className={styles.action}>
                                            {
                                                item.invited === 'true' && <NavLink to={`/chat/${item.id_response}`}><button className={styles.chatButton}>Чат</button></NavLink>
                                                ||
                                                ( item.id_response || responses.indexOf(item.id_order || item.order_id) !== -1 ) && <p className={styles.responseStatus}>Вы откликнулись</p>
                                                ||
                                                <div>
                                                    <button
                                                        onClick={ () => respond(item.order_id || item.id_order) }
                                                        disabled={loading}
                                                        type="button"
                                                        className={styles.responseButton}
                                                    >
                                                        Откликнуться
                                                    </button>
                                                    <button
                                                        onClick={ () => unrespond(item.order_id || item.id_order) }
                                                        disabled={loading}
                                                        type="button"
                                                        className={styles.uninvitingButton}
                                                    >
                                                        Не интересно
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                        <div className={styles.status}>
                                            {
                                                item.invited === 'true' && <NavLink className={styles.email} to={`/viewProfstudent/${item.id_order || item.order_id}/${item.id_student || item.student_id}`}>{item.email}</NavLink>
                                                ||
                                                item.invited === 'reject' && <p className={styles.email}>Вам отказали 🤕</p>
                                                ||
                                                item.invited === 'null' && <p className={styles.email}>Контактов пока нет 🤕</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        );
                    })
                }
            </div>
        </div>
    );
};
