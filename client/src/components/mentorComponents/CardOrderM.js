import React from 'react';
import {Link} from "react-router-dom";



export const CardOrderM = ({orders}) => {

    return(
        <div className={'center'}>
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Подходящие вас заявки😋🤝</h3>
            <div>
                {
                    orders.map((item)=> {
                        return (
                            <div className="col s12 m7" key={item.id_order}>
                                <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                    <h2 className="header">{item.direction}</h2>
                                </Link>
                                <div className="card horizontal">
                                    <div className="card-stacked">
                                        <Link to={`/viewProfappM/${item.id_order || item.order_id}`}>
                                            <div className="card-content">
                                                <p>{item.suggestions}</p>
                                            </div>
                                        </Link>
                                        <div className="card-action">
                                            <button className={'btn orange'}>Откликнуться</button>
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
