import React from 'react';
import {useHistory} from 'react-router-dom';
import styles from '../../cssModules/Notification.module.css';


export const Notification = ({clientError, setClientError, clientErrorMsg, active, setActive, clearError, error, path}) => {

    const history = useHistory();

    const hiddenNotification = () => {

        if (clientError) {

            setActive(false);
            setTimeout(()=>{
                setClientError(false);
            }, 300);
        }
        else {

            setActive(false);
            setTimeout(()=>{
                clearError();
            }, 300);

            if (path) {
                history.push(path);
            }
        }
    }

    return(
        <div className={active ? `${styles.notification} ${styles.active}` : `${styles.notification}`}>
            <div onClick={ (e) => e.stopPropagation()} className={styles.notification_content}>
                <div className={styles.notification_text}>
                    {
                        clientError
                        &&
                        clientErrorMsg
                        ||
                        error
                    }
                </div>
                <button onClick={() => hiddenNotification()} className={styles.notification_button}>Понятно</button>
            </div>
        </div>
    )
}
