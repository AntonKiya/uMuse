import React from 'react';
import {Link} from "react-router-dom";


export const CardOrderS = ({orders}) => {

    return(
        <div className={'center'}>
            <h3 style={{'backgroundColor': '#4dc3ff','color':'white','fontWeight':'bold'}}>Все заявки которые вы создали😊🍑</h3>
            <div>
                {
                    orders.map((item)=> {
                        return (
                            <div className="col s12 m7" key={item.id_order}>
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
                                            <button className={'btn red'}>Удалить</button>
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
