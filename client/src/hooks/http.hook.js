import {useState, useCallback} from 'react';


export const useHttp = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try{

            // 16 если вообще передаем body, то приводим его к строке
            // 17 и явно указываем в headers что по сети передаем json
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            setLoading(true);

            const response = await fetch(url, {method, body, headers});
            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || 'Что-то пошло не так при запросе на сервер');
            }

            setLoading(false);
            return data;

        }catch (e){
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    },[]);

    return {request, loading, error, clearError};
};
