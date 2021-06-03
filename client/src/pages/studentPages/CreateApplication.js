import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import styles from "../../cssModules/ProfileDataForm.module.css";


export const CreateApplication = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const history = useHistory();

    const [activeNotification, setActiveNotification] = useState(false);

    const [form, setForm] = useState({
        direction_id: '1',
        experience_id: '1',
        city_id:'1',
        sex_id: '1',
        type_id: '1',
        price: '0',
        ageFrom: '0',
        ageTo: '100',
        suggestions: '',
    });

    const createOrder = async () => {
        try {

            const order = await request('/api/order-student/create', 'POST', {...form}, {Authorization: `Bearer ${authContext.token}`});

            if (order) {

                history.push(`/viewProfappS/${order}`);
            }

        }catch (e){}
    };

    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error, clearError]);

    return(
        <div className={styles.profileDataForm}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div className={styles.profileForm}>
                <h4 className={styles.profileTitle}>Cоздание заявки</h4>
                <div className={styles.profileContent}>
                    <div className={styles.profileLeft}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="direction_id"
                                    value={form.direction_id}
                                    onChange={changeInputHandler}
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
                                    name="experience_id"
                                    value={form.experience_id}
                                    onChange={changeInputHandler}
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1">Низкий (0 - 2 года)</option>
                                    <option value="2">Средний (3 - 5 лет)</option>
                                    <option value="3">Высокий (6 и более лет)</option>
                                </select>
                                <label>Опыт наставника</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="city_id"
                                    value={form.city_id}
                                    onChange={changeInputHandler}
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
                            <div className={styles.inputItem}>
                                <select
                                    value={form.sex_id}
                                    onChange={changeInputHandler}
                                    name="sex_id"
                                    className={styles.inputSelect}
                                    required
                                >
                                    <option value="1" >Мужской</option>
                                    <option value="2" >Женский</option>
                                </select>
                                <label>Пол</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="ageFrom"
                                    name="ageFrom"
                                    type="text"
                                    value={form.ageFrom}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="age">Возраст от</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileRight}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="ageTo"
                                    name="ageTo"
                                    type="text"
                                    value={form.ageTo}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="age">Возраст до</label>
                            </div>
                        </div>
                        <div className={styles.inputItem}>
                            <div className={styles.inputItem}>
                                <select
                                    value={form.type_id}
                                    onChange={changeInputHandler}
                                    className={styles.inputSelect}
                                    name="type_id"
                                    required
                                >
                                    <option value="1" >Онлайн</option>
                                    <option value="2" >Оффлайн</option>
                                </select>
                                <label>Type</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={form.price}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="age">Стоимость час</label>
                            </div>
                        </div>
                        <div className={styles.interestsContainer}>
                            <div className={`${styles.inputItem} ${styles.aboutInput}`}>
                                <textarea
                                    id="suggestions"
                                    name="suggestions"
                                    type="text"
                                    value={form.suggestions}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="age">Описание</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-actions center">
                    <button onClick={createOrder}
                            disabled={loading}
                            type="button"
                            className={styles.sendButton}
                    >
                        Создать!
                    </button>
                </div>
            </div>
        </div>
    );
};
