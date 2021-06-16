import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";
import styles from "../../cssModules/componentsStyles/ProfileData.module.css"
import heartActive from "../../images/heartActive.svg";
import heartNotActive from "../../images/heartNotActive.svg";


export const ProfileMentorS = ({mentor}) => {

    const {request, loading, error, clearError} = useHttp();

    const {idOrder} = useParams();

    const authContext = useContext(AuthContext);

    const history = useHistory();

    const [liked, setLiked] = useState({...mentor});

    const [invited, setInvited] = useState([]);

    const [activeNotification, setActiveNotification] = useState(false);

    const invite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, mentorId, idResponse},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setInvited([...invited, status.mentor_id]);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'invite'});

        }catch (e){}
    };

    const uninvite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/uninviting/uninvitingStudent',
                'POST',
                {orderId: idOrder, mentorId},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            history.push(`/allResp/${status.order_id}`);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'uninvite'});

        }catch (e){}
    };

    const insert = async (mentorId) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: true});

    };

    const deleted = async (mentorId) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: false});

    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.profileData}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div className={styles.photoInfo}>
                {liked.liked && <img src={heartActive} onClick={() => deleted(mentor.id_mentor)} className={styles.editButton} /> || <img src={heartNotActive} onClick={() => insert(mentor.id_mentor)} className={styles.editButton} />}
                <img className={styles.photo} src={`/api/user/getPhoto/${mentor.photoMentor}`} alt={'ava'}/><br/>
                {
                    (mentor.invited === 'true'
                        ||
                        (invited.indexOf(mentor.id_mentor) !== -1))
                    &&
                    <div className={styles.buttonContainer}>
                        <Link to={`/chat/${mentor.id_response}`}><button className={styles.chatButton}>Написать</button></Link>
                    </div>
                    ||
                    <div className={styles.actionContainer}>
                        <button onClick={() => invite({mentorId: mentor.id_mentor, idResponse: mentor.id_response})} disabled={loading} className={styles.responseButton}>Пригласить</button>
                        <button onClick={() => uninvite({mentorId: mentor.id_mentor, idResponse: mentor.id_response})} className={styles.uninvitingButton}>Отказать</button>
                    </div>
                }
            </div>
            <div className={styles.basicInfo}>
                <div className={styles.nameContainer}><p className={styles.name}>{mentor.nameMentor}</p></div>
                <h5 className={styles.infoItem}>Connect: <span className={styles.infoItemContent}>{mentor.connectMentor}</span></h5>
                <h5 className={styles.infoItem}>Email: <span className={styles.infoItemContent}>{mentor.emailMentor}</span></h5>
                <h5 className={styles.infoItem}>Направление: <span className={styles.infoItemContent}>{mentor.direction} лет</span></h5>
                <h5 className={styles.infoItem}>Опыт: <span className={styles.infoItemContent}>{mentor.experience}</span></h5>
                <h5 className={styles.infoItem}>Город <span className={styles.infoItemContent}>{mentor.city}</span></h5>
                <h5 className={styles.infoItem}>Пол: <span className={styles.infoItemContent}>{mentor.sex}</span></h5>
                <h5 className={styles.infoItem}>Возраст: <span className={styles.infoItemContent}>{mentor.ageMentor} лет</span></h5>
                <h5 className={styles.infoItem}>Образование: <span className={styles.infoItemContent}>{mentor.educationMentor}</span></h5>
            </div>
            <div className={styles.interestsInfo}>
                <p className={styles.noticeWord}>Интересы</p>
                <div className={styles.interestsContainer}>
                    {
                        mentor.interests.map((item) => {
                            return(
                                <div key={item} className={styles.interestItem}>#{item}</div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.aboutMeInfo}>
                <p className={styles.aboutMeTitle}>О себе</p>
                <div className={styles.aboutMeContainer}>
                    {mentor.aboutMentor}
                </div>
            </div>
        </div>
    );
};
