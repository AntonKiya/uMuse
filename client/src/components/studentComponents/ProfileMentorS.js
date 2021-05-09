import React, {useContext, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import io from "../../socket-io-client";


export const ProfileMentorS = ({mentor}) => {

    const {request, loading} = useHttp();

    const {idOrder} = useParams();

    const authContext = useContext(AuthContext);

    const [liked, setLiked] = useState({...mentor});

    const [invited, setInvited] = useState([]);

    const history = useHistory();

    const invite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, mentorId, idResponse},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            setInvited([...invited, status.mentor_id]);

            console.log(invited)

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'invite'});

            alert(status.message);

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

            alert(status.order_id);

            history.push(`/allResp/${status.order_id}`);

            await io.emit('NOTICE_STUDENT', {userId: authContext.userId, mentorId: mentorId, idResponse: idResponse, orderId: idOrder, noticeType: 'uninvite'});

        }catch (e){}
    }

    const insert = async (mentorId) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: true});

        console.log(liked)


    }

    const deleted = async (mentorId) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId: idOrder}, {'Authorization': `Bearer ${authContext.token}`});

        setLiked({...liked, liked: false});

    }

    return(
        <div>
            {
                <div>
                    {liked.liked && <h3 onClick={() => deleted(mentor.id_mentor)} style={{'color':'black'}}>❤️</h3> || <h3 onClick={() => insert(mentor.id_mentor)} style={{'color':'black'}}>🤍</h3>}
                    <img style={{"display":"inline-block", "borderRadius":"5px", "width":"300px", "height":"300px"}} src={`http://localhost:5000/api/user/getPhoto/${mentor.photoMentor}`}/>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{mentor.id_mentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{mentor.nameMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{mentor.emailMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Направление: <span style={{'color':'#03a9f4'}}>{mentor.direction} лет</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт: <span style={{'color':'#03a9f4'}}>{mentor.experience}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город <span style={{'color':'#03a9f4'}}>{mentor.city}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол: <span style={{'color':'#03a9f4'}}>{mentor.sex}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{mentor.ageMentor} лет</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Образование: <span style={{'color':'#03a9f4'}}>{mentor.educationMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О менторе: <span style={{'color':'#03a9f4'}}>{mentor.aboutMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О менторе: <span style={{'color':'#03a9f4'}}>{mentor.id_response}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы:
                        {
                            mentor.interests.map((item) => {
                                return(
                                    <div style={{'display':'inline-block','backgroundColor':'red', 'padding':'5px', 'marginLeft':'3px'}}>{item}</div>
                                )
                            })
                        }
                    </h5>
                    {
                        (mentor.invited === 'true'
                            ||
                        (invited.indexOf(mentor.id_mentor) !== -1))
                        &&
                        <div>
                            <p>Ментор приглашен</p>
                            <Link to={`/chat/${mentor.id_response}`}><button className={'btn green'}>Чат</button></Link>
                        </div>
                        ||
                        <div className="card-action">
                            <button onClick={() => invite({mentorId: mentor.id_mentor, idResponse: mentor.id_response})} disabled={loading} className={'btn orange'}>Пригласить</button>
                            <button onClick={() => uninvite({mentorId: mentor.id_mentor, idResponse: mentor.id_response})} className={'btn red'}>Отказать</button>
                        </div>
                    }
                </div>

            }
        </div>
    );
};
