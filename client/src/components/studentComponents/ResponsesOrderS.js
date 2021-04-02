import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";


export const ResponsesOrderS = ({responses}) => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const {idOrder} = useParams();

    const invite = async (idMentor) => {
        try {

            const status = await request(
                '/api/order-student/invite',
                'PATCH',
                {orderId: idOrder, mentorId: idMentor},
                {'Authorization': `Bearer ${authContext.token}`}
            );

            alert(status.message);

        }catch (e){}
    };

    return(
        <div>
            {
                responses.map((item) => {
                    return(
                        <div key={item.id_order}>
                            <div className="card horizontal">
                                <div className="card-stacked">
                                    <Link to={`/viewProfmentor/${idOrder}/${item.id_mentor}`}>
                                        <div className="card-content">
                                            <h4 className="header">{item.direction}</h4>
                                            <h5>{item.nameMentor}</h5>
                                            <p>{item.city}</p>
                                            <p>{item.experience} опыт</p>
                                        </div>
                                    </Link>
                                    {/*<div className="card-action">*/}
                                    {/*    <button onClick={() => invite(item.id_mentor)} disabled={loading} className={'btn orange'}>Пригласить</button>*/}
                                    {/*    <button className={'btn red'}>Отказать</button>*/}
                                    {/*</div>*/}
                                    {
                                        item.invited !== 'true'
                                        &&
                                        <div className="card-action">
                                            <button onClick={() => invite(item.id_mentor, item.id_response)} disabled={loading} className={'btn orange'}>Пригласить</button>
                                            <button className={'btn red'}>Отказать</button>
                                        </div>
                                        ||
                                        <div>
                                            <p>Ментор приглашен</p>
                                            <Link to={`/chat/${item.id_response}`}><button className={'btn green'}>Чат</button></Link>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
