import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {Notification} from "../generalComponents/Notification";
import styles from '../../cssModules/componentsStyles/ProfileData.module.css';


export const ProfileStudentM = ({student}) => {

    const {error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.profileData}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div className={styles.photoInfo}>
                <img className={styles.photo} src={`/api/user/getPhoto/${student.photoStudent}`} alt={'ava'}/><br/>
                <div className={styles.buttonContainer}>
                    <NavLink to={`/chat/${student.id_response}`}><button className={styles.chatButton} >Написать</button></NavLink>
                </div>
            </div>
            <div className={styles.basicInfo}>
                <div className={styles.nameContainer}> <p className={styles.name}>{student.nameStudent}</p></div>
                <h5 className={styles.infoItem}>Connect: <span className={styles.infoItemContent}>{student.connectStudent}</span></h5>
                <h5 className={styles.infoItem}>Email: <span className={styles.infoItemContent}>{student.emailStudent}</span></h5>
                <h5 className={styles.infoItem}>Город <span className={styles.infoItemContent}>{student.city}</span></h5>
                <h5 className={styles.infoItem}>Возраст: <span className={styles.infoItemContent}>{student.ageStudent} лет</span></h5>
            </div>
            <div className={styles.interestsInfo}>
                <p className={styles.noticeWord}>Интересы</p>
                <div className={styles.interestsContainer}>
                    {
                    student.interests.map((item) => {
                        return(
                        <div className={styles.interestItem}>{item}</div>
                        )
                    })
                    }
                </div>
            </div>
            <div className={styles.aboutMeInfo}>
                <p className={styles.aboutMeTitle}>О себе</p>
                <div className={styles.aboutMeContainer}>
                    {student.aboutStudent}
                </div>
            </div>
        </div>
    );
};
