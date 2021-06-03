import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../../components/generalComponents/Notification";
import styles from "../../cssModules/Register.module.css";


export const Auth = ({activeAuth, activeAuthHandler, activeRecoveryHandler}) => {

    const authContext = useContext(AuthContext);

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    const [studentAuth, setStudentAuth] = useState(true);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [clientError, setClientError] = useState(false);

    const loginHandler = async () => {
        try {


            if (!form.email || !form.password) {

                setClientError(true);

                return setActiveNotification(true);
            }

            if (studentAuth) {

                const data = await request('/api/auth/loginStudent','POST',{...form});

                authContext.login(data.token, data.userId, data.userRole);

            }
            if (!studentAuth) {

                const data = await request('/api/auth/loginMentor','POST',{...form});

                authContext.login(data.token, data.userId, data.userRole);
            }

        }catch (e){}
    };

    const forgotPasswordHandler = () => {

        activeAuthHandler();
        activeRecoveryHandler();

    }

    const changeInputHandler = (event) => {

        setForm({...form, [event.target.name]: event.target.value})
    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true);
        }

    }, [error]);

    return(
        <div className={activeAuth ? `${styles.Reg} ${styles.ActiveReg}` : `${styles.Reg}`}>
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
                    <h4>{studentAuth && <p>Авторизация ученика</p> || <p>Авторизация ментора</p>}</h4>
                    <p onClick={activeAuthHandler}>X</p>
                </div>
                <div className={styles.RegContent}>
                    <div className={styles.RegContent_left}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
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
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={changeInputHandler}
                                />
                                <label className="white-text" htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.actionContainer}>
                    <button
                        onClick={loginHandler}
                        disabled={loading}
                        type="button"
                        className={styles.sendButton}
                    >
                        Войти
                    </button>
                    {
                    !studentAuth
                    &&
                    <p onClick={() => setStudentAuth(!studentAuth)} className={styles.switch}>Я ученик</p>
                    ||
                    <p onClick={() => setStudentAuth(!studentAuth)} className={styles.switch}>Я ментор</p>
                    }
                </div>
                <p onClick={forgotPasswordHandler} className={styles.forgetWord}>Забыли пароль?</p>
            </div>
        </div>
    );
};
