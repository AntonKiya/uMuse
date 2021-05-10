import React, {useContext, useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {AuthContext} from "../../context/auth.context";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";


export const RecMentor = () => {

    const authContext = useContext(AuthContext);

    const {idMentor} = useParams();

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const [mentor, setMentor] = useState(null);

    const history = useHistory();

    const getRecommend = async () => {

        const data = await request(`/api/recommend/oneMentor/${idMentor}`, 'GET', null, {'Authorization': `Bearer ${authContext.token}`});

        setMentor(data);
    };

    useEffect(() => {


        getRecommend()

    }, []);

    if (loading && !mentor) {
        return <Loader/>
    }

    if (!loading && !mentor) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <img style={{"display":"inline-block", "borderRadius":"5px", "width":"200px", "height":"200px"}} src={`http://localhost:5000/api/user/getPhoto/${mentor.photoMentor}`}/>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{mentor.id_mentor}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{mentor.nameMentor}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{mentor.emailMentor}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Направление: <span style={{'color':'#03a9f4'}}>{mentor.direction} лет</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт: <span style={{'color':'#03a9f4'}}>{mentor.experience}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город <span style={{'color':'#03a9f4'}}>{mentor.city}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол: <span style={{'color':'#03a9f4'}}>{mentor.sex}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы: <span style={{'color':'#03a9f4'}}>{
                mentor.interests.map((item) => {
                    return(
                        <div>
                            {item}
                        </div>
                    );
                })
            }</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Связаться: <span style={{'color':'#03a9f4'}}>{mentor.connectMentor}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{mentor.ageMentor} лет</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Образование: <span style={{'color':'#03a9f4'}}>{mentor.educationMentor}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О менторе: <span style={{'color':'#03a9f4'}}>{mentor.aboutMentor}</span></h5>
        </div>);
}
