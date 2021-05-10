import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useHistory} from "react-router-dom";
import {Notification} from "../../components/generalComponents/Notification";


export const RecoveryPasswordStudent = () => {

    const {request, loading, error, clearError} = useHttp();

    const history = useHistory();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    const requestCode = async () => {

            const data = await request('/api/recovery/reqoveryRequestStudent', 'POST', {userEmail: email, userPassword: password});

            if (data && data.status === 'ok'){

                setShipped(true);

                setTimeout(() => {

                    setEmail('');
                    setPassword('');
                    setShipped(false)

                }, 60000);
            }


    };

    const sendCode = async () => {

        const data = await request('/api/recovery/reqoveryStudent', 'POST', {userEmail: email, code: code});

        if (data && data.status === 'ok') {

            history.push('/');
        }

    }

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [code, setCode] = useState(null);

    const [shipped, setShipped] = useState(false)

    const changeInputHandler = (event) => {

        const name = event.target.name;

        const value = event.target.value;

        if (name === 'email') setEmail(value)

        if (name === 'password') setPassword(value)

        if (name === 'code') setCode(value)

    }

    return(
        <div className={'row'}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <div className="s6 offset-s3 light-blue-text">
                <h2>uMuse recovery student</h2>
                <div>
                    <div className="input-field col s12">
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
                    <div className="input-field col s12">
                        <input
                            id="password"
                            name="password"
                            type="text"
                            value={password}
                            placeholder={'Новый пароль'}
                            onChange={changeInputHandler}
                        />
                        <label className="white-text" htmlFor="email">Password</label>
                    </div>
                    {
                        !shipped
                        &&
                        <button
                            onClick={requestCode}
                            type="button"
                            className="waves-effect light-blue waves-light btn"
                            disabled={loading}
                        >
                            Отправить код на почту
                        </button>
                    }
                    {
                        shipped
                        &&
                        <div>
                        <div className="input-field col s12">
                            <input
                                id="code"
                                name="code"
                                type="text"
                                value={code}
                                placeholder={'Секретный код'}
                                onChange={changeInputHandler}
                            />
                            <label className="white-text" htmlFor="email">Code</label>
                        </div>
                        <button
                        onClick={sendCode}
                        type="button"
                        className="waves-effect light-blue waves-light btn"
                        disabled={loading}
                        >
                        Подтвердить код
                        </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};
