import React, {useContext, useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileOrderM} from "../../components/mentorComponents/ProfileOrderM";
import {Notification} from "../../components/generalComponents/Notification";


export const ViewProfileApplicationMentor = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const orderId = useParams().idApp;

    const [order, setOrder] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const getOrder = useCallback(async () => {
        try {

            const orderObj = await request(`/api/order-mentor/oneOrderM/${orderId}`, 'GET', null, {'Authorization': `Bearer ${authContext.token}`});

            setOrder(orderObj);

        }catch (e){}
    }, [request, orderId, authContext]);

    useEffect(() => {

        getOrder();

    }, [getOrder]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    if (loading && !order) {
        return <Loader/>
    }

    if (!loading && !order) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error} path={'/suitableapp'}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ProfileOrderM order={order}/>
        </div>
    );
};
