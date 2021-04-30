import React, {useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";


export const ProfileMentorS = ({mentor}) => {

    const {request, loading} = useHttp();

    const {idOrder} = useParams();

    const authContext = useContext(AuthContext);

    const invite = async ({mentorId, idResponse}) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, mentorId, idResponse},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            alert(status.message);

        }catch (e){}
    };

    return(
        <div>
            {
                <div>
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
                    {mentor.invited !== 'true'
                    &&
                    <div className="card-action">
                        <button onClick={() => invite({mentorId:mentor.id_mentor, idResponse: mentor.id_response})} disabled={loading} className={'btn orange'}>Пригласить</button>
                        <button className={'btn red'}>Отказать</button>
                    </div>
                    ||
                    <div>
                        <p>Ментор приглашен</p>
                        <Link to={`/chat/${mentor.id_response}`}><button className={'btn green'}>Чат</button></Link>
                    </div>
                    }
                </div>

            }
        </div>
    );
};
