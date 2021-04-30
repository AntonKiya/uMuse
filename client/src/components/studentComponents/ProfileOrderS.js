import React from 'react';
import {Link} from 'react-router-dom';


export const ProfileOrderS = ({order}) => {

    return(
        <div className={'center'}>
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Ваша заявка</h3>
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
                <p>Была создана {order.datetime}</p>
            </div>
            <Link to={`/allResp/${order.id_order}`} className={'btn orange'}>Отклики</Link>
            <button className="waves-effect waves-light btn red">Удалить</button>
        </div>
    );
};
