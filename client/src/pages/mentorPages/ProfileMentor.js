import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../../components/generalComponents/Loader";
import {ProfileDataM} from "../../components/mentorComponents/ProfileDataM";


export const ProfileMentor = () => {

    const {request, loading} = useHttp();

    const authContext = useContext(AuthContext);

    const [dataProfile, setDataProfile] = useState(null);

    const getProfileData = useCallback(async () => {
        try {

            const profileData = await request('/api/user/profileMentor', 'GET', null, {'Authorization': `Bearer ${authContext.token}`})

            setDataProfile(profileData.user);


        }catch (e){}
    }, [request, authContext]);

    useEffect(() => {

        getProfileData();

    }, [getProfileData]);

    if (loading || !dataProfile){
        return <Loader/>
    }
    
    return(
        <div>
                <ProfileDataM getProfileData={getProfileData} dataProfile={dataProfile}/>
        </div>
    );
};
