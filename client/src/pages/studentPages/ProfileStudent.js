import React, {useEffect, useCallback, useState, useContext} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileDataS} from "../../components/studentComponents/ProfileDataS";
import {Notification} from "../../components/generalComponents/Notification";

export const ProfileStudent = () => {

    const {request, loading, error, clearError} = useHttp();

    const authContext = useContext(AuthContext);

    const [dataProfile, setDataProfile] = useState(null);

    const [activeNotification, setActiveNotification] = useState(false);

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('api/user/profileStudent', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setDataProfile(profileData);

        }catch (e){}
    },[authContext, request]);

    useEffect(() => {
        getProfileData();
    },[getProfileData]);

    useEffect(() => {

        if (error) {

            setActiveNotification(true)

        }

    }, [error]);

    if (loading && !dataProfile) {
        return <Loader/>
    }

    if (!loading && !dataProfile) {
        return <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
    }

    return(
        <div>
            <Notification active={activeNotification} clearError={clearError} setActive={setActiveNotification} error={error}/>
            <ProfileDataS getProfileData={getProfileData} dataProfile={dataProfile}/>
        </div>
    );
};


