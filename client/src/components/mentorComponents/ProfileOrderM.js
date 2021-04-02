import React, {useContext} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Link} from "react-router-dom";



export const ProfileOrderM = ({order}) => {

    const {request, loadind} = useHttp();

    const authContext = useContext(AuthContext);

    const respond = async (orderId) => {

        const status = await request('/api/order-mentor/respond', 'POST', {orderId: orderId}, {Authorization: `Bearer ${authContext.token}`})

        alert(JSON.stringify(status.message));

    };

    return(
            <div className={'center'}>
                <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Заявка</h3>
                <div>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Уникальный номер заявки: <span style={{'color':'#03a9f4'}}>{order.id_order}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Музыкальное направление: <span style={{'color':'#03a9f4'}}>{order.direction}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт наставника: <span style={{'color':'#03a9f4'}}>{order.experience}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город: <span style={{'color':'#03a9f4'}}>{order.city}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол наставника: <span style={{'color':'#03a9f4'}}>{order.sex}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Тип занятий: <span style={{'color':'#03a9f4'}}>{order.type}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Цена от: <span style={{'color':'#03a9f4'}}>{order.priceFrom}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Цена до: <span style={{'color':'#03a9f4'}}>{order.priceTo}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст от: <span style={{'color':'#03a9f4'}}>{order.ageFrom}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст до: <span style={{'color':'#03a9f4'}}>{order.ageTo}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пожелания к заявке: <span style={{'color':'#03a9f4'}}>{order.suggestions}</span></h5>
                    <h5 style={{'color':'#a62bdb', 'fontWeight': 'bold'}}>Контакты для связи: <span style={{'color':'#f4033b'}}>{order.email || 'Контактов пока нет🤕'}</span></h5>
                </div>
                {
                    order.email
                    &&
                    <Link to={`/chat/${order.id_response}`}><button className={'btn green'}>Чат</button></Link>
                    ||
                    <button
                        onClick={() => respond(order.id_order)}
                        disabled={loadind}
                        className="waves-effect waves-light btn blue"
                    >
                        Откликнуться
                    </button>
                }
            </div>
    );
};
