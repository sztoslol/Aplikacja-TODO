import "./dashboard.css";
import Task from "./task/task";
import Note from "./note/note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faListCheck,
    faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    const demoData = {
        name: "Zadanie z matematyki",
        description: "Rozwiąż zadania z funkcji kwadratowej",
        expiration_date: "2023-05-31",
    };

    return (
        <>
            <div className='dashboard-topbar'></div>
            <div className='dashboard-main'>
                <div className='dashboard-left'>
                    <button className='button-add-task' type='button'>
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{ fontSize: "110%" }}
                        />
                        <div className='button-add-task-text'>
                            Dodaj zadanie
                        </div>
                    </button>

                    <div className='dashboard-taskList'>
                        <input
                            type='radio'
                            id='all'
                            name='radio-filter'
                            value='all'
                        />
                        <label htmlFor='all'>Wszystkie</label>
                        <input
                            type='radio'
                            id='saved'
                            name='radio-filter'
                            value='saved'
                        />
                        <label htmlFor='saved'>Nadchodzące</label>
                        <input
                            type='radio'
                            id='done'
                            name='radio-filter'
                            value='done'
                        />
                        <label htmlFor='done'>Wykonane</label>
                        <input
                            type='radio'
                            id='incoming'
                            name='radio-filter'
                            value='incoming'
                        />
                        <label htmlFor='incoming'>Nadchodzące</label>
                    </div>
                </div>
                <div className='dashboard-content'>
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                    <Task
                        header={demoData.name}
                        desc={demoData.description}
                        dueDate={demoData.expiration_date}
                    />
                </div>

                <div className='dashboard-right'>
                    <button className='button-add-note'>
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{ fontSize: "110%" }}
                        />
                        <div className='button-add-note-text'>
                            Dodaj zadanie
                        </div>
                    </button>
                    <div className='dashboard-right-content'>
                        <Note />
                        <Note />
                        <Note />
                        <Note />
                        <Note />
                        <Note />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
