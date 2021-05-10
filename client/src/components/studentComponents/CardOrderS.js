import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Notification} from "../generalComponents/Notification";


export const CardOrderS = ({orders}) => {

    const {request, loading, error, clearError} = useHttp();

    const [activeNotification, setActiveNotification] = useState(false);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    const authContext = useContext(AuthContext);

    const [hidden, setHidden] = useState([]);

    const deleted = async (orderId) => {

        await request('/api/order-student/deleteOrder', 'POST', {orderId}, {'Authorization': `Bearer ${authContext.token}`});

        setHidden([...hidden, orderId]);

    };

    return(
        <div className={'center'}>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Все заявки которые вы создали😊🍑</h3>
            <div>
                {
                    orders.map((item)=> {
                        return (
                            <div style={hidden.indexOf(item.id_order) !== -1 && {'display':'none'} || {'display':'block'}} className="col s12 m7" key={item.id_order}>
                                <Link to={`/viewProfappS/${item.id_order}`}>
                                    <h2 className="header">{item.direction}</h2>
                                </Link>
                                <div className="card horizontal">
                                    <div className="card-stacked">
                                        <Link to={`/viewProfappS/${item.id_order}`}>
                                            <div className="card-content">
                                                <p>{item.suggestions}</p>
                                            </div>
                                            <p>Была создана {item.datetime}</p>
                                        </Link>
                                        <div className="card-action">
                                            <Link to={`/allResp/${item.id_order}`} className={'btn orange'}>Отклики</Link>
                                            <button onClick={() => deleted(item.id_order)} className={'btn red'}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
