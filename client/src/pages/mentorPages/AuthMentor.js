import React, {useState} from 'react';
import {Link} from "react-router-dom";


export const AuthMentor = () => {

    const [form, setForm] = useState({
        email: '',
        password: '',
    });


    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    return(
        <div className={'row'}>
            <div className="s6 offset-s3 light-blue-text">
                <h2>uMuse</h2>
                <div className="card #ff9800 orange">
                    <div className="card-content white-text">
                        <h4 className="center">Авторизация наставника</h4>
                        <div>
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
                            <button onClick={() => console.log(form)} type="button" className="waves-effect light-blue waves-light btn ">Войти</button>
                            <h6 className="">Зарегистрироваться в uMuse <Link to='registermen'>Здесь</Link></h6>
                            <h6 className="">Я <Link to='/'>студент</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};