import React, {useContext, useEffect, useState, useCallback} from 'react';
import {ResponsesOrderS} from "../../components/studentComponents/ResponsesOrderS";
import {useHttp} from "../../hooks/http.hook";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";


export const AllResponsesStudent = () => {

    const [responses, setResponses] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    const authContext = useContext(AuthContext)

    const {idOrder} = useParams();

    const getResponses = useCallback(async () => {
        try{

            const responses = await request(
                '/api/order-student/allResponses',
                'POST', {orderId: idOrder},
                {'Authorization': `Bearer ${authContext.token}`}

            );

            setResponses(responses);

        }catch (e){}
    },[request, authContext, idOrder]);

    useEffect(() => {

        getResponses();

    }, [getResponses]);

    if (loading && !responses) {
        return <Loader/>
    }

    if (!loading && !responses) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error} path={'/myapps'}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ResponsesOrderS responses={responses}/>
        </div>
    );
};
