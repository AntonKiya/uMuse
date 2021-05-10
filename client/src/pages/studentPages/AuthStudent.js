import React, {useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";

export const AuthStudent = () => {

    // теперь в authContext есть все те данные и методы которые мы передаем в
    // AuthContext.Provider из хука auth.hook.js
    const authContext = useContext(AuthContext);

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const loginHandler = async () => {
        try {

            for (const field in form) {

                if(form[field] === '') {

                    throw {
                        name: 'InputError',
                        message: `Вы забыли ввести ${field}`
                    }
                };
            }

            const data = await request('/api/auth/loginStudent','POST',{...form});
            // alert(JSON.stringify(data));
            authContext.login(data.token, data.userId, data.userRole);

        }catch (e){}
    };

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const changeInputHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    return(
        <div className={'row'}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
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
                            <h6 className=""><Link to='/recoveryStudent'>Забыли пароль?</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
