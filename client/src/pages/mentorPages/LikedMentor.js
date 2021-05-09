import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/generalComponents/Loader";
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";
import {AuthContext} from "../../context/auth.context";

export const LikedMentor = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState(null);

    const getOrders = useCallback(async () => {

        const data = await request('/api/liked/allLikedMentor', 'GET', null, {'Authorization':`Bearer ${authContext.token}`});

        setOrders(data);

        console.log(data);

    }, [request, authContext]);

    useEffect(() => {

        getOrders();

    }, [getOrders])

    if (loading || !orders) {
        return <Loader/>
    }

    return(
        <div>
            <CardOrderM orders={orders} />
        </div>
    );
};
