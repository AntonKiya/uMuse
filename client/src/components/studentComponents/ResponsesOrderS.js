import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from "../../socket-io-client";
import {Notification} from "../generalComponents/Notification";
import styles from "../../cssModules/componentsStyles/ResponsesOrder.module.css";
import heartActive from "../../images/heartActive.svg";
import heartNotActive from "../../images/heartNotActive.svg";
import {PageTitle} from "../generalComponents/PageTitle";


export const ResponsesOrderS = ({responses, content}) => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const {idOrder} = useParams();

    const [activeNotification, setActiveNotification] = useState(false);

    const [liked, setLiked] = useState([...responses]);

    const [hidden, setHidden] = useState([]);

    const [invited, setInvited] = useState([]);

    const invite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, idResponse, mentorId},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setInvited([...invited, status.mentor_id]);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse,orderId: idOrder,noticeType: 'invite'});


        }catch (e){}
    };

    const uninvite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/uninviting/uninvitingStudent',
                'POST',
                {orderId: idOrder, mentorId},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setHidden([...hidden, +status.mentor_id]);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'uninvite'});


        }catch (e){}
    };

    const insert = async (mentorId, index) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = true]);

    };

    const deleted = async (mentorId, index) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked([...liked, liked[index].liked = false]);

    };

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    return(
        <div className={styles.responsesOrder}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <PageTitle content={content}/>
            {
                responses.map((item, index) => {
                    return(
                        <div key={item.id_mentor}>
                            <Link to={`/viewProfmentor/${idOrder}/${item.id_mentor}`}>
                                <div className={styles.responseItem} style={ hidden.indexOf(item.id_mentor) !== -1 && {'display':'none'} || {'display':'inline-block'}} key={item.id_order}>
                                    <div className={styles.likedContainer} onClick={event => event.preventDefault()}>
                                        {liked[index].liked && <img src={heartActive} onClick={() => deleted(item.id_mentor || item.mentor_id, index)}/> || <img src={heartNotActive} onClick={() => insert(item.id_mentor || item.mentor_id, index)} />}
                                    </div>
                                    <div className={styles.infoContainer}>
                                        <div className={styles.photoContainer}>
                                            <img className={styles.photo} src={`http://localhost:80/api/user/getPhoto/${item.photoMentor}`} alt={'ava'}/>
                                            <div className={styles.direction}>{item.direction}</div>
                                        </div>
                                        <div className={styles.basicInfoContainer}>
                                            <h5 className={styles.name}>{item.nameMentor}</h5>
                                            <p className={styles.email}>{item.emailMentor}</p>
                                            <p className={styles.experienceContainer}><p className={styles.experience}>{item.experience}</p>опыт</p>
                                            <p className={styles.about}>{item.aboutMentor}</p>
                                        </div>
                                    </div>
                                    <div onClick={event => event.preventDefault()} className={styles.actionContainer}>
                                        {
                                            (item.invited === 'true'
                                                ||
                                                invited.indexOf(item.id_mentor) !== -1
                                            )
                                            &&
                                            <div className={styles.invitedContainer}>
                                                <p>Ментор приглашен</p>
                                                <Link to={`/chat/${item.id_response}`}><button className={styles.chatBitton}>Чат</button></Link>
                                            </div>
                                            ||
                                            <div className={styles.actionContainer}>
                                                <button className={styles.responseButton} onClick={() => invite({mentorId: item.id_mentor, idResponse: item.id_response})} disabled={loading}>Пригласить</button>
                                                <button className={styles.uninvitingButton} onClick={() => uninvite({mentorId: item.id_mentor, idResponse: item.id_response})}>Отказать</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })
            }
        </div>
    );
};
