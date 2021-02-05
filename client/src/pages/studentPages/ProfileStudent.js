import React, {useEffect, useCallback, useState, useContext} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileDataS} from "../../components/studentComponents/ProfileDataS";

export const ProfileStudent = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [dataProfile, setDataProfile] = useState(null);

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('api/user/profileStudent', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setDataProfile(profileData.user);

        }catch (e){}
    },[authContext, request]);

    useEffect(() => {
        getProfileData();
    },[getProfileData])

    if(loading || !dataProfile) {
        return <Loader/>
    }


    return(
        <div>
            <ProfileDataS dataProfile={dataProfile}/>
        </div>
    );
};


