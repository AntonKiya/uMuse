import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import styles from "../../cssModules/NavBar.module.css";


export const NavBarMentor = () => {

    const authContext = useContext(AuthContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        authContext.logout();
    };

    return(
        <div className={styles.navbar}>
            <div className={styles.logo}>ЛОГО</div>
            <ul className={styles.navlinks}>
                <li className={styles.navitem}><NavLink to="/suitableapp">Все заявки</NavLink></li>
                <li className={styles.navitem}><NavLink to="/myresp">Мои отклики</NavLink></li>
                <li className={styles.navitem}><NavLink to="/profilemen">Профиль</NavLink></li>
                <li className={styles.navitem} onClick={logoutHandler}><NavLink to="/">Выйти</NavLink></li>
            </ul>
        </div>
    );
};
