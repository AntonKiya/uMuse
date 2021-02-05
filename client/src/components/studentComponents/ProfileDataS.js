import React from 'react';

export const ProfileDataS = ({dataProfile}) => {


    return(
        <div>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>id: <span style={{'color':'#03a9f4'}}>{dataProfile.id_student}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Имя: <span style={{'color':'#03a9f4'}}>{dataProfile.nameStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Email: <span style={{'color':'#03a9f4'}}>{dataProfile.emailStudent}</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>Возраст: <span style={{'color':'#03a9f4'}}>{dataProfile.ageStudent} лет</span></h5>
            <h5 style={{'color':'#ffa000', 'fontWeight': 'bold'}}>О вас: <span style={{'color':'#03a9f4'}}>{dataProfile.aboutStudent}</span></h5>
        </div>
    );
};
