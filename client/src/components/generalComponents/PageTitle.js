import React from "react";
import styles from "../../cssModules/componentsStyles/PageTitle.module.css";


export const PageTitle = ({content}) => {

    return(
        <div className={styles.pageTitle}>
            {content}
        </div>
    )
}
