import React, {useContext, useState} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import styles from '../../cssModules/componentsStyles/NavBar.module.css';
import logo from '../../images/logo.svg'


export const NavBar = () => {

    const authContext = useContext(AuthContext);

    const {userRole, isAuthenticated} = authContext;

    const [headerActive, setHeaderActive] = useState(false);

    const logoutHandler = (event) => {
        setHeaderActive(!headerActive);
        event.preventDefault();
        authContext.logout();
    };

    return(
        <div className={styles.navbar}>
            <div className={styles.headerNav}>
                <NavLink to={'/'}>
                    <div className={styles.logo_container}>
                        <img src={logo} alt={'logo'}/>
                        <span className={styles.logo_word}>Muse</span>
                    </div>
                </NavLink>
                {
                    isAuthenticated && userRole === 'student'
                    &&
                    <ul className={headerActive && `${styles.student_ul} ${styles.student_ul_active}` || styles.student_ul}>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/main">Рекомендуемые</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/likedStudent">Закладки</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/createapp">Создать</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/myapps">Мои заявки</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/profilest">Профиль</NavLink></li>
                        <li className={styles.navitem} onClick={logoutHandler}><NavLink to="/">Выйти</NavLink></li>
                    </ul>
                    ||
                    isAuthenticated && userRole === 'mentor'
                    &&
                    <ul className={headerActive && `${styles.student_ul} ${styles.student_ul_active}` || styles.student_ul}>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/likedMentor">Закладки</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/suitableapp">Все заявки</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/myresp">Мои отклики</NavLink></li>
                        <li onClick={() => setHeaderActive(!headerActive)} className={styles.navitem}><NavLink to="/profilemen">Профиль</NavLink></li>
                        <li className={styles.navitem} onClick={logoutHandler}><NavLink to="/">Выйти</NavLink></li>
                    </ul>
                }
            </div>
            {
                isAuthenticated
                &&
                <div onClick={() => setHeaderActive(!headerActive)} className={styles.headerBurger}>
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                </div>
            }
        </div>
    );
};
