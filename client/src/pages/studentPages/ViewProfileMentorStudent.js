import React, {useState, useContext, useCallback, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileMentorS} from "../../components/studentComponents/ProfileMentorS";
import {Notification} from "../../components/generalComponents/Notification";


export const ViewProfileMentorStudent = () => {

    const [mentor, setMentor] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const authContext = useContext(AuthContext)

    const {idOrder, idMentor} = useParams();

    const getMentor = useCallback(async () => {
        try{

            const mentor = await request(
                '/api/order-student/oneResponse',
                'POST', {mentorId: idMentor, orderId: idOrder},
                {'Authorization': `Bearer ${authContext.token}`}

            );

            setMentor(mentor);

        }catch (e){}
    },[request, authContext, idMentor]);

    useEffect(() => {

        getMentor();

    }, [getMentor]);

    if (loading && !mentor) {
        return <Loader/>
    }

    if (!loading && !mentor) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error} path={`/myapps`}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ProfileMentorS mentor={mentor} />
        </div>
    );
};
