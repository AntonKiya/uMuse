import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";



export const CardOrderM = ({orders}) => {

    const {request, loadind} = useHttp();

    const authContext = useContext(AuthContext);

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        alert(JSON.stringify(status.message));

    };

    return(
        <div className={'center'}>
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Подходящие вас заявки😋🤝</h3>
            <div>
                {
                    orders.map((item)=> {
                        return (
                            <div className="col s12 m7" key={item.id_order || item.order_id}>
                                <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                    <h2 className="header">{item.direction}</h2>
                                </Link>
                                <div className="card horizontal">
                                    <div className="card-stacked">
                                        <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                            <div className="card-content">
                                                <p>{item.suggestions}</p>
                                                <p>Была создана {item.datetime}</p>
                                            </div>
                                        </Link>
                                        <div className="card-action">
                                            {
                                                item.email
                                                &&
                                                <Link to={`/chat/${item.id_response}`}><button className={'btn green'}>Чат</button></Link>
                                                ||
                                                <button
                                                    onClick={ () => respond(item.order_id || item.id_order) }
                                                    disabled={loadind}
                                                    type="button"
                                                    className={'btn orange'}
                                                >
                                                    Откликнуться
                                                </button>
                                            }
                                        </div>
                                        <Link to={`/viewProfstudent/${item.id_order || item.order_id}/${item.student_id}`}>
                                            <h5 style={{'color':'#a62bdb', 'fontWeight': 'bold'}}>Контакты для связи: <span style={{'color':'#f4033b'}}>{item.email || 'Контактов пока нет🤕'}</span></h5>
                                        </Link>
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
