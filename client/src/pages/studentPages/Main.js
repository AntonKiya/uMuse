import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import {Loader} from "../../components/generalComponents/Loader";


export const Main = () => {

    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const [mentors, setMentors] = useState([]);

    const getRecommend = async () => {

        const data = await request('/api/recommend/mentors', 'GET', null, {'Authorization': `Bearer ${authContext.token}`});

        setMentors(data);
    };

    useEffect(() => {
        try {

            getRecommend()

        }catch (e){}
    }, [setMentors]);

    if (loading && !mentors) {
        return <Loader/>
    }

    if (!loading && !mentors) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            {
                mentors.map((item) => {
                    return(
                        <div>
                            <div className="card horizontal">
                                <div className="card-stacked">
                                    <Link to={`/recMentor/${item.id_mentor}`}>
                                        <div className="card-content">
                                            <h4 className="header">{item.direction}</h4>
                                            <h5>{item.nameMentor}</h5>
                                            <p>{item.city}</p>
                                            <p>{item.experience} опыт</p>
                                        </div>
                                    </Link>
                                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы: <span style={{'color':'#03a9f4'}}>{
                                        item.interests.map((item) => {
                                            return(
                                                <div>
                                                    {item}
                                                </div>
                                            );
                                        })
                                    }</span></h5>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
