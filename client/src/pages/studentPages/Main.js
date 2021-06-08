import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import {Loader} from "../../components/generalComponents/Loader";
import styles from "../../cssModules/MentorList.module.css";
import {PageTitle} from "../../components/generalComponents/PageTitle";


export const Main = () => {

    const authContext = useContext(AuthContext);

    const {request, loading, error, clearError} = useHttp();

    const [mentors, setMentors] = useState([]);

    const [activeNotification, setActiveNotification] = useState(false);

    const getRecommend = useCallback(async () => {

        const data = await request('/api/recommend/mentors', 'GET', null, {'Authorization': `Bearer ${authContext.token}`});

        setMentors(data);
    }, [request, authContext.token]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)
        }

    }, [error]);

    useEffect(() => {
        try {

            getRecommend()

        }catch (e){}

    }, [getRecommend]);

    if (loading && !mentors) {
        return <Loader/>
    }

    if (!loading && !mentors) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }

    return(
        <div className={styles.mentorList}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <PageTitle content={'Рекомендуемые наставники'}/>
            {
                mentors.map((item) => {
                    return(
                        <div key={item.id_mentor} className={styles.mentorItem}>
                            <div className={styles.infoContainer}>
                                <div className={styles.photoContainer}>
                                    <img className={styles.photo} src={`http://localhost:80/api/user/getPhoto/${item.photoMentor}`} alt={'ava'}/>
                                    <div className={styles.direction}>{item.direction}</div>
                                </div>
                                <div className={styles.basicInfoContainer}>
                                    <p className={styles.name}>{item.nameMentor}</p>
                                    <p className={styles.connect}>Связаться {item.connectMentor}</p>
                                    <p className={styles.experienceContainer}><p className={styles.experience}>{item.experience}</p>опыт</p>
                                    <p className={styles.experienceContainer}>город <p className={styles.experience}>{item.city}</p></p>
                                    <p className={styles.experienceContainer}><p className={styles.experience}>{item.ageMentor} лет</p></p>
                                    <p className={styles.experienceContainer}>Образование <p className={styles.experience}>{item.educationMentor}</p></p>

                                    <p className={styles.experienceContainer}>О себе: <p className={styles.experience}>{item.aboutMentor}</p></p>
                                    <p className={styles.interestsContainer}>
                                        {
                                            item.interests.map((interest) => {
                                                return(
                                                    <div key={interest} className={styles.interestItem}>#{interest}</div>
                                                );
                                            })
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
