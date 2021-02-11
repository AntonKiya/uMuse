import React, {useContext, useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileOrderS} from "../../components/studentComponents/ProfileOrderS";


export const ViewProfileApplicationStudent = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const orderId = useParams().idApp;

    const [order, setOrder] = useState(null);

    const getOrder = useCallback(async () => {
        try {

            const orderObj = await request(`/api/order-student/oneOrderS/${orderId}`, 'GET', null, {'Authorization': `Bearer ${authContext.token}`});

            setOrder(orderObj);

        }catch (e){}
    }, [request, orderId, authContext]);

    useEffect(() => {

        getOrder();

    }, [getOrder]);

    if (loading || !order) {
        return <Loader/>
    }

    return(
        <div>
            <ProfileOrderS order={order}/>
        </div>
    );
};
