import React, {useRef, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {State} from "../../State";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";
import styles from '../../cssModules/componentsStyles/ProfileData.module.css';
import editButton from "../../images/editButton.svg";


export const ProfileDataM = ({getProfileData, dataProfile}) => {

    const {request, error, clearError} = useHttp();

    const fileInput = useRef(null);

    const authContext = useContext(AuthContext);

    const {state, dispatch} = State();

    const [activeNotification, setActiveNotification] = useState(false);

    const deleteNotice = async (id_notice) => {

        await io.emit('DELETE_NOTICE', {
            userId: authContext.userId,
            userRole: authContext.userRole,
            id_notice: id_notice,
        });

    };

    const send = async () => {
        try {

            const data = new FormData();

            const image = fileInput.current.files[0];

            data.append('image', image);

            await request('/api/add/photo', 'POST', data,
                {
                    'Authorization': `Bearer ${authContext.token}`,
                    'type': 'formData',
                });

            getProfileData();

        }catch (e){}
    };

    useEffect(() => {

        io.emit('GET_NOTICES', {
            userId: authContext.userId,
            userRole: authContext.userRole
        });

        io.on('SET_NOTICE', (data) => {

            dispatch({
                type: 'SET_NOTICE',
                payload: data
            })
        });

    }, [authContext.userId, authContext.userRole, dispatch]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.profileData}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div className={styles.photoInfo}>
                <Link to={'/editM'}><img className={styles.editButton} src={editButton} alt={'Редактировать'}/></Link>
                <img className={styles.photo} src={`http://localhost:80/api/user/getPhoto/${dataProfile.photoMentor}`} alt={'ava'}/><br/>
                <label className={styles.btnLabel}>
                    Обновить
                    <input onChange={send} ref={fileInput} hidden={true} type="file"/>
                </label>
            </div>
            <div className={styles.notificationInfo}>
                <p className={styles.noticeWord}>Уведомления ({state.notices.length})</p>
                <div className={styles.notificationsContainer}>
                    {
                        state.notices.map((item) => {
                            return(
                                item.noticeType === 'invite' && <div key={item.id_noticeMentor} className={styles.noticeItem} onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/viewProfappM/${item.data}`}><p>Вас пригласили</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                                ||
                                item.noticeType === 'uninvite' && <div key={item.id_noticeMentor} className={styles.noticeItem} onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/viewProfappM/${item.data}`}><p>Вам отказали</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                                ||
                                item.noticeType === 'message' && <div key={item.id_noticeMentor} className={styles.noticeItem} onClick={() => deleteNotice(item.id_noticeMentor)}><Link to={`/chat/${item.data}`}><p>Сообщение</p></Link><button onClick={() => deleteNotice(item.id_noticeMentor)} >Понятно</button></div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={styles.basicInfo}>
                <div className={styles.nameContainer}> <p className={styles.name}>{dataProfile.nameMentor}</p></div>
                <h5 className={styles.infoItem}>Email: <span className={styles.infoItemContent}>{dataProfile.emailMentor}</span></h5>
                <h5 className={styles.infoItem}>Контакт для связи: <span className={styles.infoItemContent}>{dataProfile.connectMentor}</span></h5>
                <h5 className={styles.infoItem}>Город: <span className={styles.infoItemContent}>{dataProfile.city}</span></h5>
                <h5 className={styles.infoItem}>Возраст: <span className={styles.infoItemContent}>{dataProfile.ageMentor} лет</span></h5>
                <h5 className={styles.infoItem}>Опыт: <span className={styles.infoItemContent}>{dataProfile.experience}</span></h5>
                <h5 className={styles.infoItem}>Образование: <span className={styles.infoItemContent}>{dataProfile.educationMentor}</span></h5>
                <h5 className={styles.infoItem}>Муз направление: <span className={styles.infoItemContent}>{dataProfile.direction}</span></h5>
            </div>
            <div className={styles.interestsInfo}>
                <p className={styles.noticeWord}>Интересы</p>
                <div className={styles.interestsContainer}>
                    {
                        dataProfile.interests.map((item, index, array) => {
                            return(
                                <div key={item.interest} className={styles.interestItem}>#{item.interest}</div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.aboutMeInfo}>
                <p className={styles.aboutMeTitle}>О себе</p>
                <div className={styles.aboutMeContainer}>
                    {dataProfile.aboutMentor}
                </div>
            </div>
        </div>
    );
};
