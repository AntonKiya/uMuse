import React, {useState, useContext, useCallback, useEffect, useRef} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import styles from "../../cssModules/ProfileDataForm.module.css";


export const EditMentor = () => {
    
    const {request, loading, error, clearError} = useHttp();

    const history = useHistory();

    const [activeNotification, setActiveNotification] = useState(false);

    const authContext = useContext(AuthContext);

    const direction = useRef();
    const experience = useRef();
    const city = useRef();
    const sex = useRef();

    const [form, setForm] = useState(
        {
            name: '',
            connect: '',
            direction: '1',
            interests: [],
            experience: '1',
            city: '1',
            sex: '1',
            age: '',
            education: '',
            about: ''
        }
    );

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

            const profileData = await request('/api/edit-data/infmentor', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            const {nameMentor, connectMentor, directionMentor_id,experienceMentor_id, cityMentor_id, sexMentor_id, ageMentor, educationMentor, aboutMentor, interests} = profileData;

            setForm({name: nameMentor, connect: connectMentor, direction: directionMentor_id, experience: experienceMentor_id, city: cityMentor_id, sex: sexMentor_id, age: ageMentor, education: educationMentor, about: aboutMentor, interests: [...interests]});

            direction.current.options[directionMentor_id - 1].selected = true;
            experience.current.options[experienceMentor_id - 1].selected = true;
            city.current.options[cityMentor_id - 1].selected = true;
            sex.current.options[sexMentor_id - 1].selected = true;

        }catch (e){}

    },[authContext, request]);

    const edit = async () => {
        try {

            if (!form.name || !form.connect || form.interests.length === 0 || !form.age) {

                setClientError(true);

                return setActiveNotification(true);
            }

            const data = await request('/api/edit-data/editMentor', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

            if (data && data.status === 'ok') history.push('/profilemen');

        }catch (e){}
    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }
    }, [error]);

    useEffect(() => {

        getProfileData();

    }, [getProfileData]);

    return(
        <div className={styles.profileDataForm}>
            <Notification
                active={activeNotification}
                clientError={clientError}
                setClientError={setClientError}
                clientErrorMsg={'Заполните все поля'}
                clearError={clearError}
                setActive={setActiveNotification}
                error={error}
            />
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
                                <label>Имя</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="city"
                                    onChange={changeHandler}
                                    ref={city}
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1" >Санкт-Петербург</option>
                                    <option value="2" >Краснодар</option>
                                    <option value="3" >Ялта</option>
                                    <option value="4" >Казань</option>
                                    <option value="5" >Сочи</option>
                                    <option value="6" >Екатеринбург</option>
                                    <option value="7" >Тверь</option>
                                    <option value="8" >Новосибирск</option>
                                    <option value="9" >Нижний Новгород</option>
                                    <option value="10" >Челябинск</option>
                                    <option value="11" >Самара</option>
                                    <option value="12" >Омск</option>
                                    <option value="13" >Уфа</option>
                                    <option value="14" >Красноярск</option>
                                    <option value="15" >Воронеж</option>
                                    <option value="16" >Пермь</option>
                                    <option value="17" >Волгоград</option>
                                    <option value="18" >Ростов-на-Дону</option>
                                    <option value="19" >Москва</option>
                                </select>
                                <label>Город</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={`${styles.inputItem} ${styles.aboutInput}`}>
                                <textarea
                                    id="about"
                                    name="about"
                                    value={form.about}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="about">О себе</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileMiddle}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="age"
                                    name="age"
                                    type="text"
                                    value={form.age}
                                    onChange={changeHandler}
                                />
                                <label>Возраст</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="direction"
                                    onChange={changeHandler}
                                    ref={direction}
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1">Гитара</option>
                                    <option value="2">Вокал</option>
                                    <option value="3">Дабстеп</option>
                                    <option value="4">Хип-хоп</option>
                                    <option value="5">Битмэйкинг</option>
                                    <option value="6">Звукозапись</option>
                                    <option value="7">Барабаны</option>
                                    <option value="8">Виолончель</option>
                                    <option value="9">Пианино</option>
                                    <option value="10">Бас-гитара</option>
                                    <option value="11">Синтезатор</option>
                                    <option value="12">Укулеле</option>
                                    <option value="13">Фортепиано</option>
                                    <option value="14">Скрипка</option>
                                    <option value="15">Флейта</option>
                                    <option value="16">Саксофон</option>
                                </select>
                                <label>Музыкальное направление</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="experience"
                                    onChange={changeHandler}
                                    ref={experience}
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1">Низкий (0 - 2 года)</option>
                                    <option value="2">Средний (3 - 5 лет)</option>
                                    <option value="3">Высокий (6 и более лет)</option>
                                </select>
                                <label>Опыт игры</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    onChange={changeHandler}
                                    name="sex"
                                    ref={sex}
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1" >Мужской</option>
                                    <option value="2" >Женский</option>
                                </select>
                                <label>Пол</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileRight}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="education"
                                    name="education"
                                    type="text"
                                    value={form.education}
                                    onChange={changeHandler}
                                />
                                <label>Образование</label>
                            </div>
                        </div>

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
