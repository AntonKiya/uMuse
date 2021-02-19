import React from 'react';

export const ProfileMentorS = ({mentor}) => {

    return(
        <div>
            {
                <div>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{mentor.id_mentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{mentor.nameMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{mentor.emailMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Направление: <span style={{'color':'#03a9f4'}}>{mentor.direction} лет</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Опыт: <span style={{'color':'#03a9f4'}}>{mentor.experience}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Город <span style={{'color':'#03a9f4'}}>{mentor.city}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Пол: <span style={{'color':'#03a9f4'}}>{mentor.sex}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{mentor.ageMentor} лет</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Образование: <span style={{'color':'#03a9f4'}}>{mentor.educationMentor}</span></h5>
                    <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О менторе: <span style={{'color':'#03a9f4'}}>{mentor.aboutMentor}</span></h5>
                </div>

            }
        </div>
    );
};
