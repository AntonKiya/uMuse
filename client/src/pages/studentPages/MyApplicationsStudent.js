import React, {useState, useCallback, useContext, useEffect} from 'react';
import {CardOrderS} from "../../components/studentComponents/CardOrderS";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";


export const MyApplicationStudents = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState([]);

    const [activeNotification, setActiveNotification] = useState(false);

    const getOrders = useCallback(async () => {
        try {

            const ordersArray = await request('/api/order-student/allOrdersS', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setOrders(ordersArray);

        }catch (e){}
    }, [authContext, request]);

    useEffect(() => {

        getOrders();

    },[getOrders]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

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
            <CardOrderS orders={orders}/>
        </div>
    );
};
