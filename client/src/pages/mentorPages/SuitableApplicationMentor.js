import React, {useContext, useState, useEffect, useCallback} from 'react';
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";


export const SuitableApplicationMentor = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrder] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const getOrders = useCallback( async () => {
        try {

            const data = await request('/api/order-mentor/suitable0rders', 'GET', null, {'Authorization':`Bearer ${authContext.token}`})

            setOrder(data);

        }catch (e){}
    }, [request, authContext]);


    useEffect(() => {

        getOrders();

    }, [getOrders]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    if (loading && !orders) {
        return <Loader/>
    }

    if (!loading && !orders) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <CardOrderM content={'Подходящие заявки'} orders={orders}/>
        </div>
    );
};
