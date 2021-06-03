import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../generalComponents/Notification";
import styles from "../../cssModules/componentsStyles/ProfileOrder.module.css";


export const ProfileOrderS = ({order}) => {

    const {request, error, clearError} = useHttp();

    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const deleted = async (orderId) => {

        await request('/api/order-student/deleteOrder', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        history.push('/myapps');

    };

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
            <div className={styles.orderContent}>
                    <h5 className={styles.contentItem}>Уникальный номер заявки: <span>{order.id_order}</span></h5>
                    <h5 className={styles.contentItem}>Музыкальное направление: <span>{order.direction}</span></h5>
                    <h5 className={styles.contentItem}>Опыт наставника: <span className={styles.contentItem}>{order.experience}</span></h5>
                    <h5 className={styles.contentItem}>Город: <span>{order.city}</span></h5>
                    <h5 className={styles.contentItem}>Пол наставника: <span>{order.sex}</span></h5>
                    <h5 className={styles.contentItem}>Тип занятий: <span>{order.type}</span></h5>
                    <h5 className={styles.contentItem}>Стоимость час: <span>{order.price}</span></h5>
                    <h5 className={styles.contentItem}>Возраст от: <span>{order.ageFrom}</span></h5>
                    <h5 className={styles.contentItem}>Возраст до: <span>{order.ageTo}</span></h5>
                    <h5 className={styles.contentItem}>Пожелания к заявке: <span>{order.suggestions || 'пусто'}</span></h5>
            </div>
            <div className={styles.orderStatus}>
                <div className={styles.actions}>
                    <NavLink className={styles.responseButton} to={`/allResp/${order.id_order}`}>Отклики</NavLink>
                    <button className={styles.uninvitingButton} onClick={() => deleted(order.id_order)}>Удалить</button>
                </div>
            </div>
            </div>
        </div>
    );
};
