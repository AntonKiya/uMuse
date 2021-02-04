import {useState, useCallback, useEffect} from 'react'

export const useAuth = () => {



    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const [ready, setReady] = useState(false);


    const login = useCallback((jwtToken, id, role) => {

        setToken(jwtToken);
        setUserId(id);
        setUserRole(role);

        localStorage.setItem('userData', JSON.stringify({
            userId: id, token: jwtToken, userRole: role
        }));

    }, []);


    const logout = useCallback(() => {

        setToken(null);
        setUserId(null);
        setUserRole(null);

        localStorage.removeItem('userData');

    }, []);

    // проверяет есть ли что-то в localStorage и если да,
    // то записывает в локальный State.
    useEffect(() => {

        const dataStorage = JSON.parse(localStorage.getItem('userData'));

        if (dataStorage && dataStorage.token) {
            login(dataStorage.token, dataStorage.userId, dataStorage.userRole);
        }

        setReady(true);

    },[login]);

    return{ login, logout, token, userId, userRole, ready};
};
