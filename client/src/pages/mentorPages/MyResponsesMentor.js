import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {CardOrderM} from "../../components/mentorComponents/CardOrderM";


export const MyResponsesMentor = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [orders, setOrders] = useState(null);

    const getOrders = useCallback( async () => {
        try {

            const data = await request('/api/order-mentor/responses', 'GET', null, {'Authorization':`Bearer ${authContext.token}`});
            console.log(1)
            setOrders(data);

        }catch (e){}
    },[request, authContext]);

    useEffect(() => {
        getOrders();
        console.log(2)
    }, [getOrders]);

    if (loading || !orders) {
        return <Loader/>
    }

    return(
        <div>
            <CardOrderM orders={orders} />
        </div>
    );
};
