import "./dashboard.css";
import Task from "./task/task";
import Note from "./note/note";
import AddTaskForm from "./addTaskForm/addTaskForm";
import AddNoteForm from "./addNoteForm/addNoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Waveform } from "@uiball/loaders";

/*
    Obłsuga formularzy(w tym dodanie danych do bazy) znajduje się w ich komponentach
    
    TODO: 
        X Pliki cookies => token + baza danych
        -> Naprawa formularzy 
        -> Dodanie edycji zadań
        -> Naprawa błędnego przypisywania dat z formularza zadań :zbadać: -> 
            => ?serwer? 
            => ?przetwarzanie strona klienta?
        -> Wstępne testy formularzy ->
            => Logowanie
            => Rejstracja
            => Dodawanie zadań (w trakcie tworzenia)
            => Dodawanie notatek
        -> Dodać ulubione zadania
        -= Nie uwzględniono dashboard -> dokończyć =-
*/

const Dashboard = () => {
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3010/notes")
            .then((response) => response.json())
            .then((data) => setNotes(data))
            .catch((error) => console.error(error));
    }, [showAddNoteForm]);

    useEffect(() => {
        fetch("http://localhost:3010/tasks")
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error(error));
    }, [showAddTaskForm]);

    const handleAddTaskFormChange = () => {
        setShowAddTaskForm((prev) => {
            return !prev;
        });
    };
    const handleAddNoteFormChange = () => {
        setShowAddNoteForm((prev) => {
            return !prev;
        });
    };

    const handleShowAddTaskForm = () => {
        if (showAddTaskForm === false && showAddNoteForm === false)
            handleAddTaskFormChange();
    };

    const handleShowAddNoteForm = () => {
        if (showAddNoteForm === false && showAddTaskForm === false)
            handleAddNoteFormChange();
    };

    const handleCloseForm = () => {
        if (showAddTaskForm === true) handleAddTaskFormChange();
        else if (showAddNoteForm === true) handleAddNoteFormChange();
    };

    const handleEscKey = (event) => {
        if (event.keyCode === 27) {
            handleCloseForm();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [showAddTaskForm, showAddNoteForm]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long" };
        return date.toLocaleDateString("pl-PL", options);
    };

    return (
        <>
            {showAddTaskForm && (
                <AddTaskForm handleCloseForm={handleCloseForm} />
            )}
            {showAddNoteForm && (
                <AddNoteForm handleCloseForm={handleCloseForm} />
            )}
            <div className='dashboard-topbar'></div>
            <div className='dashboard-main'>
                <div className='dashboard-left'>
                    <button
                        className='button-add-task'
                        type='button'
                        onClick={() => handleShowAddTaskForm()}
                    >
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
                        <label htmlFor='saved'>Zapisane</label>
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
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Task
                                key={task.id}
                                header={task.name}
                                desc={task.description}
                                dueDate={task.due_date}
                                createdAt={task.created_at}
                            />
                        ))
                    ) : (
                        <div className='loader'>
                            <Waveform size={55} color='#231F20' />
                        </div>
                    )}
                </div>

                <div className='dashboard-right'>
                    <button
                        className='button-add-note'
                        onClick={() => handleShowAddNoteForm()}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{ fontSize: "110%" }}
                        />
                        <div className='button-add-note-text'>
                            Dodaj zadanie
                        </div>
                    </button>
                    <div className='dashboard-right-content'>
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <Note
                                    key={note.id}
                                    header={note.name}
                                    desc={note.description}
                                    date={formatDate(note.created_at)}
                                />
                            ))
                        ) : (
                            <div className='loader'>
                                <Waveform size={55} color='#231F20' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
