import React, {useState, useEffect} from 'react';
import {useHttp} from '../../hooks/http.hook';
import styles from '../../cssModules/Register.module.css';
import {Notification} from "../../components/generalComponents/Notification";
import {NavLink} from "react-router-dom";


export const RegistrStudent = ({activeRegStude, setActiveRegStude, activeRegStudeHandler, activeAuthHandler}) => {

    const {request, loading, error, clearError} = useHttp();

    const [formRegStud, setFormRegStud] = useState({
        name:'',
        email: '',
        connect: '',
        interests: [],
        city: 1,
        password: '',
    });

    const [clientError, setClientError] = useState(false);

    const [activeNotification, setActiveNotification] = useState(false);

    const [accept, setAccept] = useState(true);

    const haveAccHandler = () => {

        activeRegStudeHandler()
        activeAuthHandler()
    };

    const registrHandler = async () => {
        try {

            if (!formRegStud.name || !formRegStud.email || !formRegStud.connect || formRegStud.interests.length === 0 || !formRegStud.password) {

                setClientError(true);

                return setActiveNotification(true);
            }

                const data = await request('/api/auth/registerStudent', 'POST', {...formRegStud});

                if (data) {

                    setFormRegStud({
                        name:'',
                        email: '',
                        connect: '',
                        interests: [],
                        city: 1,
                        password: '',
                    });

                    setActiveRegStude(false);
                }

        }catch (e){}
    };

    const changeInputHandler = (event) => {

        setFormRegStud({...formRegStud, [event.target.name]: event.target.value})
    };

    const interestsHandler = (event) => {

        const id = +event.target.id;

        let index = formRegStud.interests.indexOf(id);

        if (index < 0) {

            formRegStud.interests.push(id);
            setFormRegStud({...formRegStud});
        }
        else {

            formRegStud.interests.splice(index, 1);
            setFormRegStud({...formRegStud});
        }
    };

    const acceptHandler = () => {

        setAccept(!accept);
    }

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={activeRegStude ? `${styles.Reg} ${styles.ActiveReg}` : `${styles.Reg}`}>
            <Notification
                active={activeNotification}
                clientError={clientError}
                setClientError={setClientError}
                clientErrorMsg={'Заполните все поля'}
                clearError={clearError}
                setActive={setActiveNotification}
                error={error}
            />
            <div className={styles.RegContect}>
                <div className={styles.titleContainer}>
                    <h4>Регистрация ученика</h4>
                    <p onClick={activeRegStudeHandler}>X</p>
                </div>
                <div className={styles.RegContent}>
                    <div className={styles.RegContent_left}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formRegStud.name}
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
                                    value={formRegStud.email}
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
                                    value={formRegStud.connect}
                                    placeholder={'Ссылка на соц-сеть, номер'}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="connect">Контакты для связи</label>
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
                    <div className={styles.RegContent_right}>
                        <div className={styles.interestsContainer}>
                            <label className={styles.interestsLabel} htmlFor="connect">Теги интересов</label>
                            <div className={styles.interestsItem}>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(1) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={1}>
                                    #Гитара
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(2) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={2}>
                                    #Вокал
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(3) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={3}>
                                    #Дабстеп
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(4) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={4}>
                                    #Хип-хоп
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(5) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={5}>
                                    #Битмэйкинг
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(6) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={6}>
                                    #Звукозапись
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(7) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={7}>
                                    #Барабаны
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(8) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={8}>
                                    #Виолончель
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(9) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={9}>
                                    #Пианино
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(10) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={10}>
                                    #Бас-гитара
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(11) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={11}>
                                    #Синтезатор
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(12) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={12}>
                                    #Укулеле
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(13) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={13}>
                                    #Фортепиано
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(14) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={14}>
                                    #Скрипка
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(15) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={15}>
                                    #Флейта
                                </div>
                                <div onClick={interestsHandler} className={formRegStud.interests.includes(16) ? `${styles.interestItem} ${styles.interestsItemSelected}` : `${styles.interestItem}`} id={16}>
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
                                    value={formRegStud.password}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.actionContainer}>
                    <button onClick={registrHandler}
                            disabled={loading || !accept}
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
                <p className={styles.acceptContainer}><input className={styles.accept} type="checkbox" checked={accept} onClick={acceptHandler}/> Согласие на обработку <NavLink className={styles.acceptLink}to={'/persdata'}>песрональных данных</NavLink></p>
            </div>
        </div>
    );
};
