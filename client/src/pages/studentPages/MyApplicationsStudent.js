import React, {useState, useCallback, useContext, useEffect} from 'react';
import {CardOrderS} from "../../components/studentComponents/CardOrderS";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";


export const MyApplicationStudents = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState([]);

    const getOrders = useCallback(async () => {
        try {

            const ordersArray = await request('/api/order-student/allOrdersS', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setOrders(ordersArray);

        }catch (e){}
    }, [authContext, request]);

    useEffect(() => {

        getOrders();

    },[getOrders]);

    if (loading || !orders) {
        return <Loader/>
    }

    return(
        <div>
            <CardOrderS orders={orders}/>
        </div>
    );
};
