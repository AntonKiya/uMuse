import React, {useContext, useEffect, useState, useCallback} from 'react';
import {ResponsesOrderS} from "../../components/studentComponents/ResponsesOrderS";
import {useHttp} from "../../hooks/http.hook";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";


export const AllResponsesStudent = () => {

    const [responses, setResponses] = useState(null);

    const {request, loading} = useHttp();

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

    if (!responses || loading) {
        return <Loader/>
    }

    return(
        <div>
            <ResponsesOrderS responses={responses}/>
        </div>
    );
};
