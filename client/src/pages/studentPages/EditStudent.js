import React, {useState, useContext} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/auth.context";


export const EditStudent = () => {

    const {request, loading} = useHttp();

    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [form, setForm] = useState({
        name: '', age: '', about: ''
    });

    const changeHandler = (event) => {

        setForm({...form, [event.target.name]: event.target.value});

    };

    const edit = async () => {
        try {

            if (!form.name || !form.age) {
                return alert('Некорректное имя или возраст')
            }

            const data = await request('/api/edit-data/editStudent', 'PATCH', {...form}, {'Authorization': `Bearer ${authContext.token}`});

            setForm({name: '', age: '', about: ''});

            alert(data.message);

            history.push('/profilest');

        }catch (e){}
    };

    return(
        <div>
            <h5 className="blue-text">Редактирование профиля студента 🤨🛠</h5>
            <div className="card-content white-text">
                <div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="age"
                                name="age"
                                type="text"
                                value={form.age}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="age">Age</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="about"
                                name="about"
                                type="text"
                                value={form.about}
                                onChange={changeHandler}
                            />
                            <label className="orange-text" htmlFor="email">About</label>
                        </div>
                    </div>
                    <button onClick={edit} disabled={loading} type="button" className="btn blue">Применить</button>
                </div>
            </div>
        </div>
    )
};
