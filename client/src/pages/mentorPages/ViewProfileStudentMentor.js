import React, {useCallback, useState, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../context/auth.context";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileStudentM} from "../../components/mentorComponents/ProfileStudentM";


export const ViewProfileStudentMentor = () => {

    const [student, setStudent] = useState(null);

    const {request, loading} = useHttp();

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

    if (!student || loading) {
        return <Loader/>
    }

    return(
        <div>
            <ProfileStudentM student={student} />
        </div>
    );
};
