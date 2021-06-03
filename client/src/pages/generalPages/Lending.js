import React, {useState} from 'react';
import styles from '../../cssModules/Lending.module.css';
import lendingStudent from '../../images/lendingStudent.svg';
import lendingMentor from '../../images/lendingMentor.svg';
import {RegistrStudent} from '../studentPages/RegistrStudent';
import {RegistrMentor} from '../mentorPages/RegistrMentor';
import {Auth} from "./Auth";
import {RecoveryPassword} from '../../components/generalComponents/RecoveryPassword';

export const Lending = () => {


    const [activeRegStude, setActiveRegStude] = useState(false);

    const [activeRegMentor, setActiveRegMentor] = useState(false);

    const [activeAuth, setActiveAuth] = useState(false);

    const [activeRecovery, setActiveRecovery] = useState(false);

    const activeRegStudeHandler = () => {

        setActiveRegStude(!activeRegStude);
    }

    const activeRegMentorHandler = () => {

        setActiveRegMentor(!activeRegMentor);
    }

    const activeAuthHandler = () => {

        setActiveAuth(!activeAuth);
    }

    const activeRecoveryHandler = () => {

        setActiveRecovery(!activeRecovery);
    }

    return(
        <div className={styles.lending_container}>
            <RegistrStudent activeRegStude={activeRegStude} setActiveRegStude={setActiveRegStude} activeRegStudeHandler={activeRegStudeHandler} activeAuthHandler={activeAuthHandler}/>
            <RegistrMentor activeRegMentor={activeRegMentor} setActiveRegMentor={setActiveRegMentor} activeRegMentorHandler={activeRegMentorHandler} activeAuthHandler={activeAuthHandler}/>
            <Auth activeAuth={activeAuth} activeAuthHandler={activeAuthHandler} activeRecoveryHandler={activeRecoveryHandler}/>
            <RecoveryPassword activeRecovery={activeRecovery} setActiveRecovery={setActiveRecovery} activeRecoveryHandler={activeRecoveryHandler}/>
            <h1 className={styles.title}>
                Здесь ты найдешь друга, который научит тебя играть на гитаре 🎸
            </h1>
            <div className={styles.buttons}>
                <div onClick={activeRegStudeHandler} className={styles.buttonItem}>
                    <p>Хочу учиться</p>
                    <img className={styles.lendingStudent} src={lendingStudent} alt={'U'}/>
                </div>
                <div onClick={activeRegMentorHandler} className={styles.buttonItem}>
                    <p>Хочу научить</p>
                    <img className={styles.lendingMentor} src={lendingMentor} alt={'mentor'}/>
                </div>
            </div>
        </div>
    );
}
