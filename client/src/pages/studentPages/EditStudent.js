import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import styles from '../../cssModules/Interests.module.css';
import {connect} from "mongoose";
import {Notification} from "../../components/generalComponents/Notification";


export const EditStudent = () => {

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [form, setForm] = useState({
        name: '',
        age: '',
        connect: '',
        interests: [],
        about: ''
    });

    const changeHandler = (event) => {

        setForm({...form, [event.target.name]: event.target.value});

    };

    const log = (event) => {

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
    }

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('/api/edit-data/infstudent', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            const {nameStudent, ageStudent, connectStudent, aboutStudent, interests} = profileData;

            setForm({name:nameStudent,age: ageStudent, connect: connectStudent, about: aboutStudent, interests: [...interests]});

        }catch (e){}

    },[authContext, request]);

    useEffect(() => {

        getProfileData();

    }, []);

    const edit = async () => {
        try {

            const data = await request('/api/edit-data/editStudent', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

        }catch (e){}
    };

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <h5 className="blue-text">Редактирование профиля студента 🤨🛠</h5>
            <div className="card-content white-text">
                <div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="age"
                                name="age"
                                type="text"
                                value={form.age}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="age">Age</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
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
                    <div className="row">
                        <div className="input-field col s12">
                            <div onClick={log} className={form.interests.includes(1) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={1}>
                                Гитара
                            </div>
                            <div onClick={log} className={form.interests.includes(2) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={2}>
                                Вокал
                            </div>
                            <div onClick={log} className={form.interests.includes(3) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={3}>
                                Дабстеп
                            </div>
                            <div onClick={log} className={form.interests.includes(4) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={4}>
                                Хип-хоп
                            </div>
                            <div onClick={log} className={form.interests.includes(5) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={5}>
                                Битмэйкинг
                            </div>
                            <div onClick={log} className={form.interests.includes(6) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={6}>
                                Звукозапись
                            </div>
                            <div onClick={log} className={form.interests.includes(7) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={7}>
                                Барабаны
                            </div>
                            <div onClick={log} className={form.interests.includes(8) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={8}>
                                Виолончель
                            </div>
                            <div onClick={log} className={form.interests.includes(9) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={9}>
                                Пианино
                            </div>
                            <div onClick={log} className={form.interests.includes(10) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={10}>
                                Бас-гитара
                            </div>
                            <div onClick={log} className={form.interests.includes(11) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={11}>
                                Синтезатор
                            </div>
                            <div onClick={log} className={form.interests.includes(12) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={12}>
                                Укулеле
                            </div>
                            <div onClick={log} className={form.interests.includes(13) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={13}>
                                Фортепиано
                            </div>
                            <div onClick={log} className={form.interests.includes(14) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={14}>
                                Скрипка
                            </div>
                            <div onClick={log} className={form.interests.includes(15) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={15}>
                                Флейта
                            </div>
                            <div onClick={log} className={form.interests.includes(16) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={16}>
                                Саксофон
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="about"
                                name="about"
                                type="text"
                                value={form.about}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="email">About</label>
                        </div>
                    </div>
                    <button onClick={edit} disabled={loading} type="button" className="btn blue">Применить</button>
                </div>
            </div>
        </div>
    )
};
