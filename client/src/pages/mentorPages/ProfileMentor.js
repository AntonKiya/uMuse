import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileDataM} from "../../components/mentorComponents/ProfileDataM";
import {Notification} from "../../components/generalComponents/Notification";


export const ProfileMentor = () => {

    const [activeNotification, setActiveNotification] = useState(false);

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [dataProfile, setDataProfile] = useState(null);

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('/api/user/profileMentor', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setDataProfile(profileData.user);


        }catch (e){}
    }, [request, authContext]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true);

        }

    }, [error]);

    useEffect(() => {

        getProfileData();

    }, [getProfileData]);

    if (loading && !dataProfile) {
        return <Loader/>
    }

    if (!loading && !dataProfile) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>

    }
    
    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ProfileDataM getProfileData={getProfileData} dataProfile={dataProfile}/>
        </div>
    );
};
