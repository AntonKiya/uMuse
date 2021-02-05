import React from 'react';


export const ProfileDataM = ({dataProfile}) => {


    return(
        <div>
            <div>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{dataProfile.id_mentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{dataProfile.nameMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{dataProfile.emailMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город: <span style={{'color':'#03a9f4'}}>{dataProfile.city}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{dataProfile.ageMentor} лет</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О вас: <span style={{'color':'#03a9f4'}}>{dataProfile.aboutMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт: <span style={{'color':'#03a9f4'}}>{dataProfile.experience}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Образование: <span style={{'color':'#03a9f4'}}>{dataProfile.educationMentor}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Муз направление: <span style={{'color':'#03a9f4'}}>{dataProfile.direction}</span></h5>
                <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол: <span style={{'color':'#03a9f4'}}>{dataProfile.sex}</span></h5>
            </div>
        </div>
    );
};
