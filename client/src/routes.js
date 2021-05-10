import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom';
import {CreateApplication} from "./pages/studentPages/CreateApplication";
import {ProfileStudent} from "./pages/studentPages/ProfileStudent";
import {MyApplicationStudents} from "./pages/studentPages/MyApplicationsStudent";
import {ViewProfileApplicationStudent} from "./pages/studentPages/ViewProfileApplicationStudent";
import {ProfileMentor} from "./pages/mentorPages/ProfileMentor";
import {SuitableApplicationMentor} from "./pages/mentorPages/SuitableApplicationMentor";
import {AuthStudent} from "./pages/studentPages/AuthStudent";
import {AuthMentor} from "./pages/mentorPages/AuthMentor";
import {RegistrStudent} from "./pages/studentPages/RegistrStudent";
import {RegistrMentor} from "./pages/mentorPages/RegistrMentor";
import {AllResponsesStudent} from "./pages/studentPages/AllResponsesStudent";
import {ViewProfileMentorStudent} from "./pages/studentPages/ViewProfileMentorStudent";
import {MyResponsesMentor} from "./pages/mentorPages/MyResponsesMentor";
import {ViewProfileApplicationMentor} from "./pages/mentorPages/ViewProfileApplicationMentor";
import {ViewProfileStudentMentor} from "./pages/mentorPages/ViewProfileStudentMentor";
import {EditStudent} from "./pages/studentPages/EditStudent";
import {EditMentor} from "./pages/mentorPages/EditMentor";
import {RoomChat} from "./pages/RoomChat";
import {Main} from "./pages/studentPages/Main";
import {RecMentor} from "./pages/studentPages/RecMentor";
import {LikedStudent} from "./pages/studentPages/LikedStudent";
import {LikedMentor} from "./pages/mentorPages/LikedMentor";
import {RecoveryPasswordMentor} from "./pages/mentorPages/RecoveryPasswordMentor";
import {RecoveryPasswordStudent} from "./pages/studentPages/RecoveryPasswordStudent";
import {UndefSt} from "./pages/studentPages/UndefSt";
import {UndefMen} from "./pages/mentorPages/UndefMen";

export const useRoutes = (isAuthenticated, role) => {

    if (isAuthenticated && role === 'student') {
        return(
          <Switch>
              <Route path={'/main'}>
                  <Main/>
              </Route>
              <Route path={'/recMentor/:idMentor'}>
                  <RecMentor/>
              </Route>
              <Route path={'/profilest'}>
                  <ProfileStudent/>
              </Route>
              <Route path={'/editS'}>
                  <EditStudent/>
              </Route>
              <Route path={'/createapp'} exact>
                  <CreateApplication/>
              </Route>
              <Route path={'/myapps'} exact>
                  <MyApplicationStudents/>
              </Route>
              <Route path={'/likedStudent'} exact>
                  <LikedStudent/>
              </Route>
              <Route path={'/viewProfappS/:idApp'}>
                  <ViewProfileApplicationStudent/>
              </Route>
              <Route path={'/allResp/:idOrder'}>
                  <AllResponsesStudent/>
              </Route>
              <Route path={'/viewProfmentor/:idOrder/:idMentor'}>
                  <ViewProfileMentorStudent/>
              </Route>
              <Route path={'/chat/:roomId'}>
                  <RoomChat />
              </Route>
              <Route path={'/undef'}>
                  <UndefSt />
              </Route>
              <Redirect to={'/main'} />
          </Switch>
        );
    }
    else if (isAuthenticated && role === 'mentor') {
        return(
            <Switch>
                <Route path={'/profilemen'} exact>
                    <ProfileMentor/>
                </Route>
                <Route path={'/editM'}>
                    <EditMentor/>
                </Route>
                <Route path={'/myresp'} exact>
                    <MyResponsesMentor/>
                </Route>
                <Route path={'/likedMentor'} exact>
                    <LikedMentor/>
                </Route>
                <Route path={'/suitableapp'} exact>
                    <SuitableApplicationMentor/>
                </Route>
                <Route path={'/viewProfappM/:idApp'}>
                    <ViewProfileApplicationMentor/>
                </Route>
                <Route path={'/viewProfstudent/:idOrder/:idStudent'}>
                    <ViewProfileStudentMentor/>
                </Route>
                <Route path={'/chat/:roomId'}>
                    <RoomChat />
                </Route>
                <Route path={'/undef'}>
                    <UndefMen />
                </Route>
                <Redirect to={'/suitableapp'} />
            </Switch>
        );
    }

    return (
        <Switch>
            <Route path={'/'} exact>
                <AuthStudent/>
            </Route>
            <Route path={'/authmen'} exact>
                <AuthMentor/>
            </Route>
            <Route path={'/registerst'} exact>
                <RegistrStudent/>
            </Route>
            <Route path={'/registermen'} exact>
                <RegistrMentor/>
            </Route>
            <Route path={'/recoveryStudent'} exact>
                <RecoveryPasswordStudent/>
            </Route>
            <Route path={'/recoveryMentor'} exact>
                <RecoveryPasswordMentor/>
            </Route>
            <Redirect to={'/'} />
        </Switch>
    );
};
