import {useState, useCallback, useContext} from 'react';
import {AuthContext} from "../context/auth.context";


export const useHttp = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authContext = useContext(AuthContext);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try{

            // 16 если вообще передаем body, то приводим его к строке
            // 17 и явно указываем в headers что по сети передаем json
            if (body && headers.type !== 'formData') {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            setLoading(true);

            const response = await fetch(url, {method, body, headers});
            const data = await response.json();

            if (!response.ok){

                if (response.status === 401) {

                    authContext.logout()
                }

                throw new Error(data.message || 'Что-то пошло не так при запросе на сервер');
            }

            setLoading(false);
            return data;

        }catch (e){
            setLoading(false);
            setError(e.message);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    },[]);

    return {request, loading, error, clearError};
};
