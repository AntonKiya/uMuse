import React, {useState, useEffect} from 'react';
import {useHttp} from '../../hooks/http.hook';
import styles from '../../cssModules/Register.module.css';
import {Notification} from "../../components/generalComponents/Notification";


export const RegistrMentor = ({activeRegMentor, setActiveRegMentor, activeRegMentorHandler, activeAuthHandler}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    const [formRegMent, setFormRegMent] = useState({
        name: '',
        email: '',
        connect:'',
        direction:'1',
        experience: '1',
        interests: [],
        city: '1',
        sex: '1',
        age: '',
        password: '',
    });

    const [clientError, setClientError] = useState(false);

    const haveAccHandler = () => {

        activeRegMentorHandler()
        activeAuthHandler()
    };

    const registrHandler = async () => {
        try {

            if (!formRegMent.name || !formRegMent.email || !formRegMent.connect || formRegMent.interests.length === 0 || !formRegMent.sex || !formRegMent.age || !formRegMent.password) {

                setClientError(true);

                return setActiveNotification(true);
            }

            const data = await request('/api/auth/registerMentor', 'POST', {...formRegMent});

            if (data) {

                setFormRegMent({
                    name: '',
                    email: '',
                    connect:'',
                    direction:'1',
                    experience: '1',
                    interests: [],
                    city: '1',
                    sex: '1',
                    age: '',
                    password: '',
                })

                setActiveRegMentor(false);
            }

        }catch (e){}
    };

    const changeInputHandler = (event) => {

        setFormRegMent({...formRegMent, [event.target.name]: event.target.value})
    };

    const interestsHandler = (event) => {

        const id = +event.target.id;

        let index = formRegMent.interests.indexOf(id);

        if (index < 0) {

            formRegMent.interests.push(id);
            setFormRegMent({...formRegMent});
        }
        else {

            formRegMent.interests.splice(index, 1);
            setFormRegMent({...formRegMent});
        }

    }

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    return(
        <div className={activeRegMentor ? `${styles.Reg} ${styles.ActiveReg}` : `${styles.Reg}`}>
            <Notification
                active={activeNotification}
                clientError={clientError}
                setClientError={setClientError}
                clientErrorMsg={'Заполните все поля'}
                clearError={clearError}
                setActive={setActiveNotification}
                error={error}/>
            <div className={styles.RegContect}>
                <div className={styles.titleContainer}>
                    <h4>Регистрация ментора </h4>
                    <p onClick={activeRegMentorHandler}>X</p>
                </div>
                <div className={styles.RegContent}>
                    <div className={styles.RegContent_left}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formRegMent.name}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="name">Имя</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formRegMent.email}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="connect"
                                    name="connect"
                                    type="text"
                                    value={formRegMent.connect}
                                    onChange={changeInputHandler}
                                    placeholder={'Ссылка на соц-сеть, номер'}
                                />
                                <label className="white-text" htmlFor="email">Контакт для связи</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    onChange={changeInputHandler}
                                    name="sex"
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
                                <select
                                    name="city"
                                    onChange={changeInputHandler}
                                    required
                                    className={styles.inputSelect}
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
                    </div>
                    <div className={styles.RegMentorContent_middle}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="age"
                                    name="age"
                                    type="text"
                                    value={formRegMent.age}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="age">Возраст</label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <select
                                    name="direction"
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
                                    name="experience"
                                    onChange={changeInputHandler}
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
                    </div>
                    <div className={styles.RegMentorContent_right}>
                        <div className={styles.interestsContainer}>
                            <label className={styles.interestsLabel} htmlFor="connect">Теги навыков</label>
                            <div className={styles.interestsItem}>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(1) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={1}>
                                    #Гитара
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(2) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={2}>
                                    #Вокал
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(3) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={3}>
                                    #Дабстеп
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(4) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={4}>
                                    #Хип-хоп
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(5) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={5}>
                                    #Битмэйкинг
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(6) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={6}>
                                    #Звукозапись
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(7) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={7}>
                                    #Барабаны
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(8) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={8}>
                                    #Виолончель
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(9) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={9}>
                                    #Пианино
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(10) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={10}>
                                    #Бас-гитара
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(11) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={11}>
                                    #Синтезатор
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(12) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={12}>
                                    #Укулеле
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(13) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={13}>
                                    #Фортепиано
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(14) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={14}>
                                    #Скрипка
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(15) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={15}>
                                    #Флейта
                                </div>
                                <div onClick={interestsHandler} className={formRegMent.interests.includes(16) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={16}>
                                    #Саксофон
                                </div>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formRegMent.password}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.actionContainer}>
                    <button onClick={registrHandler}
                            disabled={loading}
                            type="button"
                            className={styles.sendButton}
                    >
                        Зарегистрироваться
                    </button>
                    <p className={styles.forgetWord}
                       onClick={haveAccHandler}>
                        Уже есть аккаунт ?
                    </p>
                </div>
            </div>
        </div>
    );
};
