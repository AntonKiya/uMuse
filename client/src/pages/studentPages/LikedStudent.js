import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Link} from "react-router-dom";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";
import styles from "../../cssModules/MentorList.module.css";
import heartActive from "../../images/heartActive.svg";
import heartNotActive from "../../images/heartNotActive.svg";
import {PageTitle} from "../../components/generalComponents/PageTitle";


export const LikedStudent = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [liked, setLiked] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const insert = async ({mentorId, orderId, index}) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId}, {'Authorization': `Bearer ${authContext.token}`});

        const newLiked = liked.map( (item, itemindex) => {

            if (itemindex === index) {

                item.likedStudent = true;
            }

            return item
        });

        setLiked(newLiked)

    };

    const deleted = async ({mentorId, orderId, index}) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId}, {'Authorization': `Bearer ${authContext.token}`});

        const newLiked = liked.map( (item, itemindex) => {

            if (itemindex === index) {

                item.likedStudent = false;
            }

            return item
        });

        setLiked(newLiked)
    };

    const getLiked = useCallback( async () => {

        const likedMentors = await request('api/liked/allLikedStudent', 'GET', null, {'Authorization':`Bearer ${authContext.token}`});

        setLiked(likedMentors);
    }, [request, authContext.token]);

    useEffect(() => {

        getLiked();

    }, [getLiked]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    if (loading && !liked) {
        return <Loader/>
    }

    if (!loading && !liked) {

        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
    }

    return(
        <div className={styles.mentorList}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <PageTitle content={'Закладки'}/>
            {
                liked.map((item, index) => {
                    return(
                        <div key={item.id_mentor} className={styles.mentorItem}>
                            {item.likedStudent && liked[index].likedStudent && <img className={styles.heart} src={heartActive} onClick={() => deleted({orderId: item.id_order, mentorId: item.id_mentor, index})} alt={'❤️'}/> || <img className={styles.heart} src={heartNotActive} onClick={() => insert({orderId: item.id_order, mentorId: item.id_mentor, index})} alt={'🤍'}/>}
                            <div className={styles.infoContainer}>
                                <div className={styles.photoContainer}>
                                    <img className={styles.photo} src={`http://localhost:80/api/user/getPhoto/${item.photoMentor}`} alt={'ava'}/>
                                    <div className={styles.direction}>{item.directionMentor}</div>
                                </div>
                                <div className={styles.basicInfoContainer}>
                                    <p className={styles.name}>{item.nameMentor}</p>
                                    <p className={styles.connect}>Связаться {item.connectMentor}</p>
                                    <p className={styles.experienceContainer}><p className={styles.experience}>{item.experienceMentor}</p>опыт</p>
                                    <p className={styles.experienceContainer}>город <p className={styles.experience}>{item.cityMentor}</p></p>
                                    <p className={styles.experienceContainer}>Возраст <p className={styles.experience}>{item.ageMentor}</p></p>
                                    <p className={styles.experienceContainer}>Образование <p className={styles.experience}>{item.educationMentor}</p></p>
                                    <p className={styles.interestsContainer}>
                                        {
                                            item.interestsMentor.map((interest) => {
                                                return(
                                                    <div key={item} className={styles.interestItem}>#{interest}</div>
                                                );
                                            })
                                        }
                                    </p>
                                    <p className={styles.experienceContainer}>
                                        Откликнулся на заявки
                                        <div className={styles.responseOrdersContainer}>
                                            {
                                                item.order.map( (order) => {
                                                    return(
                                                        <div className={styles.responseOrder}>
                                                            <Link to={`/allResp/${order.order}`}>
                                                                <h3 className={styles.responseDirection}>
                                                                    {order.direction}
                                                                </h3>
                                                                <p className={styles.responseSuggestion}>
                                                                    {
                                                                        order.suggestions
                                                                        ||
                                                                        "Описания нет"
                                                                    }

                                                                </p>
                                                            </Link>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
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
