import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useHttp} from '../../hooks/http.hook';
import styles from '../../cssModules/Interests.module.css'


export const RegistrMentor = () => {

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error){
            alert(error)
        }
        clearError();

    },[error, clearError]);

    const [form, setForm] = useState({
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

    const registrHandler = async () => {
        try {

            const data = await request('/api/auth/registerMentor', 'POST', {...form});
            alert(data.message);

        }catch (e){}
    };

    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const interestsHandler = (event) => {

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

    return(
        <div className={'row'}>
            <div className="s6 offset-s3 light-blue-text">
                <h2>uMuse</h2>
                <div className="card #ff9800 orange">
                    <div className="card-content white-text">
                        <h4 className="center">Регистрация наставника</h4>
                        <div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="name">Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="connect"
                                        name="connect"
                                        type="text"
                                        value={form.connect}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="email">Connect method</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        name="direction"
                                        onChange={changeInputHandler}
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
                                    <label>Music direction</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        name="experience"
                                        onChange={changeInputHandler}
                                        required
                                    >
                                        <option value="1">Низкий (0 - 2 года)</option>
                                        <option value="2">Средний (3 - 5 лет)</option>
                                        <option value="3">Высокий (6 и более лет)</option>
                                    </select>
                                    <label>Experience of playing</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <div onClick={interestsHandler} className={form.interests.includes(1) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={1}>
                                        Гитара
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(2) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={2}>
                                        Вокал
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(3) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={3}>
                                        Дабстеп
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(4) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={4}>
                                        Хип-хоп
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(5) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={5}>
                                        Битмэйкинг
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(6) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={6}>
                                        Звукозапись
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(7) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={7}>
                                        Барабаны
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(8) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={8}>
                                        Виолончель
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(9) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={9}>
                                        Пианино
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(10) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={10}>
                                        Бас-гитара
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(11) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={11}>
                                        Синтезатор
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(12) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={12}>
                                        Укулеле
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(13) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={13}>
                                        Фортепиано
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(14) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={14}>
                                        Скрипка
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(15) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={15}>
                                        Флейта
                                    </div>
                                    <div onClick={interestsHandler} className={form.interests.includes(16) ? `${styles.interestsItemSelected}` : `${styles.interestsItem}`} id={16}>
                                        Саксофон
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        name="city"
                                        onChange={changeInputHandler}
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
                                    <label>City</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        onChange={changeInputHandler}
                                        name="sex"
                                        required
                                    >
                                        <option value="1" >Мужской</option>
                                        <option value="2" >Женский</option>
                                    </select>
                                    <label>Sex</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="age"
                                        name="age"
                                        type="text"
                                        value={form.age}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Age</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="password">Password</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-actions center">
                            <button onClick={registrHandler}
                                    disabled={loading}
                                    type="button"
                                    className="waves-effect light-blue waves-light btn "
                            >
                                Зарегистрироваться
                            </button>
                            <h6 className="">Назад к <Link to='authmen'>Авторизации</Link></h6>
                            <h6 className="">Я <Link to='/'>студент</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
