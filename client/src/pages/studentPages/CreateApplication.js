import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";



export const CreateApplication = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const history = useHistory();

    const createOrder = async () => {
        try {

            const order = await request('/api/order-student/create', 'POST', {...form}, {Authorization: `Bearer ${authContext.token}`});

            history.push(`/viewProfappS/${order}`);

        }catch (e){}
    };

    useEffect(() => {

        if (error){
            alert(error)
        }
        clearError();

    },[error, clearError]);

    const [form, setForm] = useState({
        direction_id: '1',
        experience_id: '1',
        city_id:'1',
        sex_id: '1',
        type_id: '1',
        priceFrom: '0',
        priceTo: '1300',
        ageFrom: '0',
        ageTo: '100',
        suggestions: '',
    });

    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    return(
        <div className={'row'}>
            <div className="s6 offset-s3 light-blue-text">
                <h2>Найди своего наставника 🤩</h2>
                <div className="card #ff9800 orange">
                    <div className="card-content white-text">
                        <h4 className="center">создание заявки</h4>
                        <div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        name="direction_id"
                                        value={form.direction_id}
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
                                        name="experience_id"
                                        value={form.experience_id}
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
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        name="city_id"
                                        value={form.city_id}
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
                                        value={form.sex_id}
                                        onChange={changeInputHandler}
                                        name="sex_id"
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
                                    <select
                                        style={{fontSize: "16px", background: "transparent", border: "none", color: "white"}}  className='browser-default'
                                        value={form.type_id}
                                        onChange={changeInputHandler}
                                        name="type_id"
                                        required
                                    >
                                        <option value="1" >Онлайн</option>
                                        <option value="2" >Оффлайн</option>
                                    </select>
                                    <label>Type</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="priceFrom"
                                        name="priceFrom"
                                        type="text"
                                        value={form.priceFrom}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Price from</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="priceTo"
                                        name="priceTo"
                                        type="text"
                                        value={form.priceTo}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Price to</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="ageFrom"
                                        name="ageFrom"
                                        type="text"
                                        value={form.ageFrom}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Age from</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="ageTo"
                                        name="ageTo"
                                        type="text"
                                        value={form.ageTo}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Age to</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="suggestions"
                                        name="suggestions"
                                        type="text"
                                        value={form.suggestions}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="age">Sugestions</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-actions center">
                            <button onClick={createOrder}
                                    disabled={loading}
                                    type="button"
                                    className="waves-effect light-blue waves-light btn "
                            >
                                Создать!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
