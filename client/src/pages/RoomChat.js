import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import io from '../socket-io-client';
import {AuthContext} from "../context/auth.context";
import {State} from '../State';
import styles from '../cssModules/Interests.module.css';


export const RoomChat = () => {

    const {roomId} = useParams();

    const authContext = useContext(AuthContext)

    const userId = authContext.userId;
    const userRole = authContext.userRole;

    const [form, setForm] = useState(null);

    const {state, dispatch} = State();

    useEffect(() => {

        io.emit('USER_JOIN', {userId, roomId});

        io.on('GET_MESSAGES', data => {

            dispatch({
                type:'GET_MESSAGES',
                payload: {
                    messages: data
                }
            })

        });

        io.on('SET_MESSAGES', data => {

            dispatch({
                type:'SET_MESSAGES',
                payload: {
                    messages: data
                }
            })
        })


    }, [dispatch]);

    const send = () => {

        const date = new Date();

        const time = date.getHours() + ':' + date.getMinutes()

        io.emit('NEW_MESSAGE', {roomId: roomId, message: {userId: userId, userRole: userRole, text: form, date: time} });

    };


    return(
        <div className="chat col-6">
            <div className="chat-users">
                <b>В комнате сейчас:</b>
                <ol>
                    {/*{*/}
                    {/*    state.users.map(item => {*/}
                    {/*        return(*/}
                    {/*            <li>{item}</li>*/}
                    {/*        );*/}
                    {/*    })*/}
                    {/*}*/}
                </ol>
            </div>
            <div className="chat-messages">
                <div className="messages">
                    {
                        state.messages.map((item) => {

                            return(
                                <div className={userRole === item.userRole && `${styles.message} ${styles.owner}` || `${styles.message}`}>
                                    <div className={styles.messageContent}>
                                        <h5 className={styles.text}>{item.text}</h5>
                                    </div>
                                    <p className={styles.date}>{item.date}</p>
                                </div>
                            );

                        })
                    }
                </div>
                <form>
                    <textarea
                        // onChange={(event) => setForm(event.target.value)}
                        value={form}
                        rows='3'
                        cols='50'
                        onChange={(event) => setForm(event.target.value)}
                    /><br/>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={send}
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};
