import React, {useState, useContext} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";


export const EditMentor = () => {

    const {request, loading} = useHttp();

    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [form, setForm] = useState(
        {
            name: '',
            direction: '1',
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

    const edit = async () => {
        try {

            if (!form.name || !form.age) {
                return alert('Некорректное имя или возраст')
            }

            const data = await request('/api/edit-data/editMentor', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

            setForm({
                name: '',
                direction: '1',
                experience: '1',
                city: '1',
                sex: '1',
                age: '',
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
