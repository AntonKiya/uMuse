import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/generalComponents/Loader";
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";

export const LikedMentor = () => {

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState(null);

    const getOrders = useCallback(async () => {

        const data = await request('/api/liked/allLikedMentor', 'GET', null, {'Authorization':`Bearer ${authContext.token}`});

        setOrders(data);

    }, [request, authContext]);

    useEffect(() => {

        getOrders();

    }, [getOrders]);

    if (loading && !orders) {
        return <Loader/>
    }

    if (!loading && !orders) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <CardOrderM orders={orders} />
        </div>
    );
};
