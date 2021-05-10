import React, {useCallback, useState, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../context/auth.context";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileStudentM} from "../../components/mentorComponents/ProfileStudentM";
import {Notification} from "../../components/generalComponents/Notification";


export const ViewProfileStudentMentor = () => {

    const [student, setStudent] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const {idOrder, idStudent} = useParams();

    const getStudent = useCallback(async () => {
        try{

            const student = await request(
                '/api/order-mentor/orderOwner',
                'POST', {studentId: idStudent, orderId: idOrder},
                {'Authorization': `Bearer ${authContext.token}`}

            );

            setStudent(student);

        }catch (e){}
    },[request, authContext, idStudent]);

    useEffect(() => {

        getStudent();

    }, [getStudent]);

    if (loading && !student) {
        return <Loader/>
    }

    if (!loading && !student) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error} path={'/suitableapp'}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ProfileStudentM student={student} />
        </div>
    );
};
