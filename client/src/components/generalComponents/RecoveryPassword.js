import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Notification} from "./Notification";
import styles from "../../cssModules/Register.module.css";


export const RecoveryPassword = ({activeRecovery, setActiveRecovery, activeRecoveryHandler}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    const [studentRecovery, setStudentRecovery] = useState(true);

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [code, setCode] = useState('');

    const [clientError, setClientError] = useState(false);

    const [shipped, setShipped] = useState(false);

    const requestCode = async () => {

        if (!email || !password) {

            setClientError(true);

            return setActiveNotification(true);
        }

        if (studentRecovery) {

            const data = await request('/api/recovery/reqoveryRequestStudent', 'POST', {userEmail: email, userPassword: password});

            if (data && data.status === 'ok'){

                setShipped(true);

                setTimeout(() => {

                    setEmail('');
                    setPassword('');
                    setShipped(false)

                }, 60000);
            }
        }

        if (!studentRecovery) {

            const data = await request('/api/recovery/reqoveryRequestMentor', 'POST', {userEmail: email, userPassword: password});

            if (data && data.status === 'ok'){

                setShipped(true);

                setTimeout(() => {

                    setEmail('');
                    setPassword('');
                    setShipped(false)

                }, 60000);
            }
        }

    };

    const sendCode = async () => {

        if (studentRecovery) {

            const data = await request('/api/recovery/reqoveryStudent', 'POST', {userEmail: email, code: code});

            if (data && data.status === 'ok') {

                setEmail('');
                setPassword('');
                setCode('');

                setActiveRecovery(false);
            }
        }
        if (!studentRecovery) {

            const data = await request('/api/recovery/reqoveryMentor', 'POST', {userEmail: email, code: code});

            if (data && data.status === 'ok') {

                setEmail('');
                setPassword('');
                setCode('');

                setActiveRecovery(false);
            }
        }
    }

    const changeInputHandler = (event) => {

        const name = event.target.name;

        const value = event.target.value;

        if (name === 'email') setEmail(value)

        if (name === 'password') setPassword(value)

        if (name === 'code') setCode(value)

    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    return(
        <div className={activeRecovery ? `${styles.Reg} ${styles.ActiveReg}` : `${styles.Reg}`}>
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
                    <h4>{studentRecovery && <p>Сброс пароля ученика</p> || <p>Сброс пароля ментора</p>}</h4>
                    <p onClick={activeRecoveryHandler}>X</p>
                </div>
                <div className={styles.RegContent}>
                    <div className={styles.RegContent_left}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputItem}>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                placeholder={'Ваша почта'}
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
                                value={password}
                                placeholder={'Новый пароль'}
                                onChange={changeInputHandler}
                            />
                            <label className="white-text" htmlFor="email">Пароль</label>
                            </div>
                        </div>
                        {
                            shipped
                            &&
                            <div className={styles.inputContainer}>
                                <div className={styles.inputItem}>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        value={code}
                                        placeholder={'Секретный код'}
                                        onChange={changeInputHandler}
                                    />
                                    <label className="white-text" htmlFor="email">Код</label>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {
                    shipped
                    &&
                    <div>
                        <button
                            onClick={sendCode}
                            type="button"
                            className={styles.sendButton}
                            disabled={loading}
                        >
                            Подтвердить код
                        </button>
                    </div>
                    ||
                    !shipped
                    &&
                    <div className={styles.actionContainer}>
                        <button
                            onClick={requestCode}
                            type="button"
                            className={styles.sendButton}
                            disabled={loading}
                        >
                            Отправить код на почту
                        </button>
                        {
                            !studentRecovery
                            &&
                            <p onClick={() => setStudentRecovery(!studentRecovery)} className={styles.switch}>Я ученик</p>
                            ||
                            <p onClick={() => setStudentRecovery(!studentRecovery)} className={styles.switch}>Я ментор</p>
                        }
                    </div>
                }
            </div>
        </div>
    );
};
