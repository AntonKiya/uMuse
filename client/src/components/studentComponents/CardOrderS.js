import React, {useContext, useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../generalComponents/Notification";
import styles from "../../cssModules/componentsStyles/Order.module.css";
import {PageTitle} from "../generalComponents/PageTitle";


export const CardOrderS = ({orders}) => {

    const {request, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const [hidden, setHidden] = useState([]);

    const deleted = async (orderId) => {

        await request('/api/order-student/deleteOrder', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setHidden([...hidden, orderId]);

    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.cardOrder}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <PageTitle content={'Ваши заявки'}/>
            <div className={styles.cardsContainer}>
                {
                    orders.map((item)=> {
                        return (
                            <NavLink className={styles.orderCard} to={`/viewProfappS/${item.id_order}`} style={hidden.indexOf(item.id_order) !== -1 && {'display':'none'} || {'display':'inline-block'}} key={item.id_order}>
                                <div className={styles.directionContainer}>
                                    <h2>{item.direction}</h2>
                                </div>
                                <div className={styles.suggestions}>
                                    <p>{item.suggestions}</p>
                                </div>
                                <div className={styles.infoContainer}>
                                    <div className={styles.created}>была создана <p className={styles.datetime}>{item.datetime}</p></div>
                                    <div className={styles.statusContainer}>
                                        <NavLink className={styles.responseButton} to={`/allResp/${item.id_order}`}><div>Отклики</div></NavLink>
                                        <button onClick={event =>{
                                            event.preventDefault();
                                            deleted(item.id_order);
                                        }}
                                        className={styles.deleteButton}>
                                            Удалить
                                        </button>
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
