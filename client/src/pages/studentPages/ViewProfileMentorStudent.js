import React, {useState, useContext, useCallback, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileMentorS} from "../../components/studentComponents/ProfileMentorS";


export const ViewProfileMentorStudent = () => {

    const [mentor, setMentor] = useState(null);

    const {request, loading} = useHttp();

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

    if (!mentor || loading) {
        return <Loader/>
    }

    return(
        <div>
            <ProfileMentorS mentor={mentor} />
        </div>
    );
};
