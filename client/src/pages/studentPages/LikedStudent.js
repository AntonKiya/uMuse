import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Link} from "react-router-dom";
import {Loader} from "../../components/generalComponents/Loader";
import {Notification} from "../../components/generalComponents/Notification";



export const LikedStudent = () => {

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const [liked, setLiked] = useState(null);

    useEffect(async () => {

        const likedMentors = await request('api/liked/allLikedStudent', 'GET', null, {'Authorization':`Bearer ${authContext.token}`});

        setLiked(likedMentors);

    }, []);

    const insert = async ({mentorId, orderId, index}) => {

        await request('/api/liked/studentLiked', 'POST', {mentorId, orderId}, {'Authorization': `Bearer ${authContext.token}`});

        const newLiked = liked.map( (item, itemindex) => {

            if (itemindex === index) {

                item.likedStudent = true;
            }

            return item
        });

        setLiked(newLiked)

    }

    const deleted = async ({mentorId, orderId, index}) => {

        await request('/api/liked/studentUnliked', 'POST', {mentorId, orderId}, {'Authorization': `Bearer ${authContext.token}`});

        const newLiked = liked.map( (item, itemindex) => {

            if (itemindex === index) {

                item.likedStudent = false;
            }

            return item
        });

        setLiked(newLiked)

    }

    if (loading && !liked) {
        return <Loader/>
    }

    if (!loading && !liked) {

        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            {
                liked.map((item, index) => {
                    return(
                        <div className="col s12 m7" key={item.id_order}>
                            <div className="card horizontal">
                                <div className="card-stacked">
                                    {item.likedStudent && liked[index].likedStudent && <h3 onClick={() => deleted({orderId: item.id_order, mentorId: item.id_mentor, index})} style={{'color':'black'}}>❤️</h3> || <h3 onClick={() => insert({orderId: item.id_order, mentorId: item.id_mentor, index})} style={{'color':'black'}}>🤍</h3>}
                                    <img style={{"display":"inline-block", "borderRadius":"5px", "width":"50px", "height":"50px"}} src={`http://localhost:5000/api/user/getPhoto/${item.photoMentor}`}/>
                                    <p>Ментор айди{item.id_mentor}</p>
                                    <p>email {item.emailMentor}</p>
                                    <p>Имя {item.nameMentor}</p>
                                    <p>Направление {item.directionMentor}</p>
                                    <h5>
                                        Откликнулся на заявки:
                                        {
                                            item.order.map( (order) => {
                                                return(
                                                    <div style={{'background-color':'#ee6e73', 'width':'auto'}} >
                                                        <Link to={`/allResp/${order.order}`}>
                                                            <h6>
                                                                {order.direction}
                                                            </h6>
                                                            <p>{order.suggestions}...</p>
                                                        </Link><br/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </h5>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
