import React, {useEffect, useContext, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import io from '../../socket-io-client';
import {AuthContext} from "../../context/auth.context";
import {State} from '../../State';
import styles from '../../cssModules/Roomchat.module.css';


export const RoomChat = () => {

    const {roomId} = useParams();

    const authContext = useContext(AuthContext)

    const userId = authContext.userId;
    const userRole = authContext.userRole;

    const {state, dispatch} = State();

    const [form, setForm] = useState('');

    const messageContainer = useRef(null);

    const send = () => {

        const date = new Date();

        const time = date.getHours() + ':' + date.getMinutes()

        if (form) {

            io.emit('NEW_MESSAGE', {userId, userRole, roomId: roomId, noticeType: 'message', message: {userId: userId, userRole: userRole, text: form, date: time} });

            setForm('');
        }
    };

    useEffect(() => {

        if (messageContainer.current) {

            messageContainer.current.scrollBy(0, 500);
        }

    }, [dispatch]);


    useEffect(() => {

        io.emit('USER_JOIN', {userId, roomId, userRole});

        io.on('GET_MESSAGES', async (data) => {

            await dispatch({
                type:'GET_MESSAGES',
                payload: {
                    messages: data
                }
            });

            if (messageContainer.current) {

                messageContainer.current.scrollBy(0, messageContainer.current.scrollHeight);

            }
        });

        io.on('SET_MESSAGES', async (data) => {

            await dispatch({
                type:'SET_MESSAGES',
                payload: {
                    messages: data
                }
            });

            if (messageContainer.current) {

                messageContainer.current.scrollBy(0, messageContainer.current.scrollHeight);
            }
        })


    }, [dispatch, roomId, userId, userRole]);


    return(
        <div className={styles.roomChat}>
            <div className={styles.roomChatContent}>
                <div ref={messageContainer} className={styles.messageContainer}>
                    {
                        state.messages.map((item) => {

                            return(
                                <div className={userRole === item.userRole && `${styles.message} ${styles.owner}` || `${styles.message}`}>
                                    <div className={styles.messageContent}>
                                        <h5 className={styles.text}>{item.text}</h5>
                                    </div>
                                    <div className={styles.clearFix}/>
                                    <p className={styles.date}>{item.date}</p>
                                </div>
                            );

                        })
                    }
                </div>
                <form className={styles.chatForm}>
                    <textarea
                        value={form}
                        rows='3'
                        cols='50'
                        onChange={(event) => setForm(event.target.value)}
                    /><br/>
                    <button
                        type="button"
                        className={styles.sendButton}
                        onClick={send}
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};
