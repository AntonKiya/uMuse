import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import styles from '../../cssModules/NavBar.module.css';


export const NavBarStudent = () => {

    const authContext = useContext(AuthContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        authContext.logout();
    };

    return(
        <div className={styles.navbar}>
            <div className={styles.logo}>ЛОГО</div>
            <ul className={styles.navlinks}>
                <li className={styles.navitem}><NavLink to="/likedStudent">Закладки</NavLink></li>
                <li className={styles.navitem}><NavLink to="/createapp">Создать</NavLink></li>
                <li className={styles.navitem}><NavLink to="/myapps">Мои заявки</NavLink></li>
                <li className={styles.navitem}><NavLink to="/profilest">Профиль</NavLink></li>
                <li className={styles.navitem} onClick={logoutHandler}><NavLink to="/">Выйти</NavLink></li>
            </ul>
        </div>
    );
};
