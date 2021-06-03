import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import styles from "../../cssModules/ProfileDataForm.module.css";


export const EditStudent = () => {

    const {request, loading, error, clearError} = useHttp();

    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const [form, setForm] = useState({
        name: '',
        age: '',
        connect: '',
        interests: [],
        about: ''
    });

    const [clientError, setClientError] = useState(false);

    const changeHandler = (event) => {

        setForm({...form, [event.target.name]: event.target.value});

    };

    const include = (event) => {

        const id = +event.target.id;

        let index = form.interests.indexOf(id);

        if (index < 0) {

            form.interests.push(id);
            setForm({...form});
        }
        else {

            form.interests.splice(index, 1);
            setForm({...form});
        }
    };

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('/api/edit-data/infstudent', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            const {nameStudent, ageStudent, connectStudent, aboutStudent, interests} = profileData;

            setForm({name:nameStudent,age: ageStudent, connect: connectStudent, about: aboutStudent, interests: [...interests]});

        }catch (e){}

    },[authContext, request]);

    const edit = async () => {
        try {

            if (!form.name || !form.connect || form.interests.length === 0 || !form.age) {

                setClientError(true);

                return setActiveNotification(true);
            }

            const data = await request('/api/edit-data/editStudent', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

            if (data && data.status === 'ok') history.push('/profilest');

        }catch (e){}
    };

    useEffect(() => {

        getProfileData();

    }, [getProfileData]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    return(
        <div className={styles.profileDataForm}>
            <Notification
                active={activeNotification}
                clientError={clientError}
                setClientError={setClientError}
                clientErrorMsg={'Заполните все поля'}
                clearError={clearError}
                setActive={setActiveNotification}
                error={error}/>
            <div className={styles.profileForm}>
                <h4 className={styles.profileTitle}>Редактирование профиля</h4>
                <div className={styles.profileContent}>
                    <div className={styles.profileLeft}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={changeHandler}
                                />
                                <label className="orange-text" htmlFor="name">Имя</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="age"
                                    name="age"
                                    type="text"
                                    value={form.age}
                                    onChange={changeHandler}
                                />
                                <label className="orange-text" htmlFor="age">Возраст</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="connect"
                                    name="connect"
                                    type="text"
                                    value={form.connect}
                                    onChange={changeHandler}
                                />
                                <label className="orange-text" htmlFor="age">Connect</label>
                            </div>
                        </div>
                        <div>
                            <div className={`${styles.inputItem} ${styles.aboutInput}`}>
                                <textarea
                                    id="about"
                                    name="about"
                                    type="text"
                                    value={form.about}
                                    onChange={changeHandler}
                                />
                                <label className="orange-text" htmlFor="email">О себе</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileRight}>
                        <div className={styles.interestsContainer}>
                            <label className={styles.interestsLabel} htmlFor="connect">Теги интересов</label>
                            <div className={styles.interestsItem}>
                                <div onClick={include} className={form.interests.includes(1) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={1}>
                                    #Гитара
                                </div>
                                <div onClick={include} className={form.interests.includes(2) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={2}>
                                    #Вокал
                                </div>
                                <div onClick={include} className={form.interests.includes(3) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={3}>
                                    #Дабстеп
                                </div>
                                <div onClick={include} className={form.interests.includes(4) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={4}>
                                    #Хип-хоп
                                </div>
                                <div onClick={include} className={form.interests.includes(5) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={5}>
                                    #Битмэйкинг
                                </div>
                                <div onClick={include} className={form.interests.includes(6) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={6}>
                                    #Звукозапись
                                </div>
                                <div onClick={include} className={form.interests.includes(7) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={7}>
                                    #Барабаны
                                </div>
                                <div onClick={include} className={form.interests.includes(8) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={8}>
                                    #Виолончель
                                </div>
                                <div onClick={include} className={form.interests.includes(9) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={9}>
                                    #Пианино
                                </div>
                                <div onClick={include} className={form.interests.includes(10) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={10}>
                                    #Бас-гитара
                                </div>
                                <div onClick={include} className={form.interests.includes(11) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={11}>
                                    #Синтезатор
                                </div>
                                <div onClick={include} className={form.interests.includes(12) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={12}>
                                    #Укулеле
                                </div>
                                <div onClick={include} className={form.interests.includes(13) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={13}>
                                    #Фортепиано
                                </div>
                                <div onClick={include} className={form.interests.includes(14) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={14}>
                                    #Скрипка
                                </div>
                                <div onClick={include} className={form.interests.includes(15) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={15}>
                                    #Флейта
                                </div>
                                <div onClick={include} className={form.interests.includes(16) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={16}>
                                    #Саксофон
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={edit} disabled={loading} type="button" className={styles.sendButton}>Применить</button>
            </div>
        </div>
    )
};
