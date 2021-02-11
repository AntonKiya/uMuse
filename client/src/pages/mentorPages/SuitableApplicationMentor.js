import React, {useContext, useState, useEffect, useCallback} from 'react';
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";


export const SuitableApplicationMentor = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrder] = useState(null);

    const getOrders = useCallback( async () => {
        try {

            const data = await request('/api/order-mentor/suitable0rders', 'GET', null, {'Authorization':`Bearer ${authContext.token}`})

            setOrder(JSON.stringify(data));

        }catch (e){}
    }, [request, authContext]);


    useEffect(() => {

        getOrders();

    }, [getOrders]);

    if (loading || !orders) {
        return <Loader/>
    }

    return(
        <div onClick={getOrders}>
            <CardOrderM orders={orders}/>
        </div>
    );
};
