import React, {useState, useContext, useCallback, useEffect, useRef} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import styles from '../../cssModules/Interests.module.css'


export const EditMentor = () => {

    const {request, loading} = useHttp();

    const history = useHistory();

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

    useEffect(() => {

        getProfileData();

    }, []);


    const edit = async () => {
        try {

            if (!form.name || !form.age) {
                return alert('Некорректное имя или возраст')
            }

            const data = await request('/api/edit-data/editMentor', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

            setForm({
                name: '',
                connect: '',
                direction: '1',
                experience: '1',
                city: '1',
                sex: '1',
                age: '',
                interests: [],
                education: '',
                about: ''
            });

            alert(data.message);

            history.push('/profilemen');

        }catch (e){}
    };

    return(
        <div>
            <h5 className="blue-text">Редактирование профиля ментора 🤨🛠</h5>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={changeHandler}
                    />
                    <label style={{paddingTop: "15px"}} className="orange-text" htmlFor="name">Name</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <select
                        style={{fontSize: "16px", background: "transparent", border: "none", color: "orange"}}  className='browser-default'
                        name="direction"
                        onChange={changeHandler}
                        ref={direction}
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
                    <label style={{paddingTop: "15px"}}>Music direction</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <select
                        style={{fontSize: "16px", background: "transparent", border: "none", color: "orange"}}  className='browser-default'
                        name="experience"
                        onChange={changeHandler}
                        ref={experience}
                        required
                    >
                        <option value="1">Низкий (0 - 2 года)</option>
                        <option value="2">Средний (3 - 5 лет)</option>
                        <option value="3">Высокий (6 и более лет)</option>
                    </select>
                    <label style={{paddingTop: "15px"}}>Experience of playing</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <select
                        style={{fontSize: "16px", background: "transparent", border: "none", color: "orange"}}  className='browser-default'
                        name="city"
                        onChange={changeHandler}
                        ref={city}
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
                    <label style={{paddingTop: "15px"}}>City</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <select
                        style={{fontSize: "16px", background: "transparent", border: "none", color: "orange"}}  className='browser-default'
                        onChange={changeHandler}
                        name="sex"
                        ref={sex}
                        required
                    >
                        <option value="1" >Мужской</option>
                        <option value="2" >Женский</option>
                    </select>
                    <label style={{paddingTop: "15px"}}>Sex</label>
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
                    <label style={{paddingTop: "15px"}} className="orange-text" htmlFor="age">Age</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id="education"
                        name="education"
                        type="text"
                        value={form.education}
                        onChange={changeHandler}
                    />
                    <label style={{paddingTop: "15px"}} className="orange-text" htmlFor="education">Education</label>
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
                    <label style={{paddingTop: "15px"}} className="orange-text" htmlFor="about">About you</label>
                </div>
            </div>
            <button onClick={edit} disabled={loading} type="button" className="btn blue">Применить</button>
        </div>
    )
};
