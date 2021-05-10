import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../generalComponents/Notification";


export const ProfileStudentM = ({student}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const {idOrder} = useParams();

    const authContext = useContext(AuthContext);

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            {
                <div>
                    <img style={{"display":"inline-block", "borderRadius":"5px", "width":"300px", "height":"300px"}} src={`http://localhost:5000/api/user/getPhoto/${student.photoStudent}`}/>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{student.id_student}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{student.nameStudent}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{student.emailStudent}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город <span style={{'color':'#03a9f4'}}>{student.city}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{student.ageStudent} лет</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О менторе: <span style={{'color':'#03a9f4'}}>{student.aboutStudent}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Интересы:
                        {
                            student.interests
                                ?
                            student.interests.map((item) => {
                                return(
                                    <div style={{'display':'inline-block','backgroundColor':'red', 'padding':'5px', 'marginLeft':'3px'}}>{item}</div>
                                )
                            })
                                :
                                <h5>пока пусто</h5>
                        }
                    </h5>
                    <div>
                        <p>Вы были приглашены</p>
                        <Link to={`/chat/${student.id_response}`}><button className={'btn green'}>Чат</button></Link>
                    </div>
                </div>

            }
        </div>
    );
};
