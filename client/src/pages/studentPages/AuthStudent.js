import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";

export const AuthStudent = () => {


    const {request, loading, error, clearError} = useHttp();


    const loginHandler = async () => {
        try {

            const data = await request('/api/auth/loginStudent','POST',{...form});

        }catch (e){}
    };

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {

        if (error){
            alert(error)
        }
        clearError();

    },[error, clearError]);


    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    return(
        <div className={'row'}>
            <div className="s6 offset-s3 light-blue-text">
                <h2>uMuse</h2>
                <div className="card #ff9800 orange">
                    <div className="card-content white-text">
                        <h4 className="center">Авторизация студента</h4>
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
                            <button
                                onClick={loginHandler}
                                type="button"
                                className="waves-effect light-blue waves-light btn"
                                disabled={loading}
                            >
                                Войти
                            </button>
                            <h6 className="">Зарегистрироваться в uMuse <Link to='registerst'>Здесь</Link></h6>
                            <h6 className="">Я <Link to='authmen'>наставник</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};