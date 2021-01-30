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

export const useRoutes = (isAuthenticated, role) => {

    if (isAuthenticated && role === 'student') {
        return(
          <Switch>
              <Route path={'/profilest'}>
                  <ProfileStudent/>
              </Route>
              <Route path={'/createapp'} exact>
                  <CreateApplication/>
              </Route>
              <Route path={'/myapps'} exact>
                  <MyApplicationStudents/>
              </Route>
              <Route path={'/viewProfappS/:idApp'}>
                  <ViewProfileApplicationStudent/>
              </Route>
              <Route path={'/allResp'} exact>
                  <AllResponsesStudent/>
              </Route>
              <Route path={'/viewProfmentor/:idMentor'}>
                  <ViewProfileMentorStudent/>
              </Route>
              <Redirect to={'/profilest'} />
          </Switch>
        );
    }
    else if (isAuthenticated && role === 'mentor') {
        return(
            <Switch>
                <Route path={'/profilemen'} exact>
                    <ProfileMentor/>
                </Route>
                <Route path={'/myresp'} exact>
                    <MyResponsesMentor/>
                </Route>
                <Route path={'/suitableapp'} exact>
                    <SuitableApplicationMentor/>
                </Route>
                <Route path={'/viewProfappM/:idApp'}>
                    <ViewProfileApplicationMentor/>
                </Route>
                <Route path={'/viewProfstudent/:idStudent'}>
                    <ViewProfileStudentMentor/>
                </Route>
                <Redirect to={'/profilemen'} />
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
            <Redirect to={'/'} />
        </Switch>
    );
};