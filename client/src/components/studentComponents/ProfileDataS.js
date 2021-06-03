import React, {useRef, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {State} from '../../State';
import io from '../../socket-io-client';
import {Notification} from "../generalComponents/Notification";
import styles from '../../cssModules/componentsStyles/ProfileData.module.css';
import editButton from '../../images/editButton.svg';


export const ProfileDataS = ({getProfileData, dataProfile}) => {

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

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

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
                <Link to={'/editS'}><img className={styles.editButton} src={editButton} alt={'Редактировать'}/></Link>
                <img className={styles.photo} src={`http://localhost:5000/api/user/getPhoto/${dataProfile.photoStudent}`} alt={'ava'}/><br/>
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
                                item.noticeType === 'response' && <div key={item.id_noticeStudent} className={styles.noticeItem} onClick={() => deleteNotice(item.id_noticeStudent)}><Link to={`/allResp/${item.data}`}><p>новый отклик</p></Link><button onClick={() => deleteNotice(item.id_noticeStudent)}>ок</button></div>
                                ||
                                item.noticeType === 'message' && <div key={item.id_noticeStudent} className={styles.noticeItem} onClick={() => deleteNotice(item.id_noticeStudent)}><Link to={`/chat/${item.data}`}><p>Сообщение</p></Link><button onClick={() => deleteNotice(item.id_noticeStudent)} >ок</button></div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={styles.basicInfo}>
                <div className={styles.nameContainer}> <p className={styles.name}>{dataProfile.nameStudent}</p> <p className={styles.email}>{dataProfile.emailStudent}</p></div>
                <h5 className={styles.infoItem}>Контакт для связи: <span className={styles.infoItemContent}>{dataProfile.connectStudent}</span></h5>
                <h5 className={styles.infoItem}>Город: <span className={styles.infoItemContent}>{dataProfile.city}</span></h5>
                <h5 className={styles.infoItem}>Возраст: <span className={styles.infoItemContent}>{dataProfile.ageStudent} лет</span></h5>
            </div>
            <div className={styles.interestsInfo}>
                    <p className={styles.noticeWord}>Интересы</p>
                <div className={styles.interestsContainer}>
                    {
                        dataProfile.interests.map((item) => {
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
                    {dataProfile.aboutStudent}
                </div>
            </div>
        </div>
    );
};
