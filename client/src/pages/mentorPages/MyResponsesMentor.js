import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";
import {Notification} from "../../components/generalComponents/Notification";


export const MyResponsesMentor = () => {

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState(null);

    const getOrders = useCallback( async () => {
        try {

            const data = await request(
                '/api/order-mentor/responses',
                'GET', null,
                {'Authorization':`Bearer ${authContext.token}`}
            );

            setOrders(data);

        }catch (e){}
    },[request, authContext]);

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
