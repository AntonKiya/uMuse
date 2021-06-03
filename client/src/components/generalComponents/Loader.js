import React from 'react';
import styles from '../../cssModules/componentsStyles/Loader.module.css';

export const Loader = () => {


    return(
        <div className={styles.loader}>
            <h1 className={styles.text}>Подождите...</h1>
        </div>
    );
};
