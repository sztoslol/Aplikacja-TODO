import { ToastContainer, toast } from "react-toastify";
import AddTaskForm from "./addTaskForm/addTaskForm";
import AddNoteForm from "./addNoteForm/addNoteForm";
import Task from "./task/task";
import Note from "./note/note";
import Cookies from "js-cookie";
import { Setting2, LogoutCurve } from "iconsax-react";
import { useState, useEffect } from "react";
import { Waveform } from "@uiball/loaders";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";

/*
    Obłsuga formularzy(w tym dodanie danych do bazy) znajduje się w ich komponentach
    
    TODO: 
        -> Pliki cookies => token + baza danych
        -> Naprawa formularzy
        -> Dodanie edycji zadań
        -> Wstępne testy formularzy ->
            => Logowanie
            => Rejstracja
            => Dodawanie zadań (w trakcie tworzenia)
            => Dodawanie notatek
        -> Zablokować możlowość loginu `none`
        -> Naprawić błąd związany z niezapisywaniem do session storage odpowiadnich danych 
        -= Nie uwzględniono dashboard -> dokończyć =-
*/

const Dashboard = ({ onLogOut }) => {
    const [userLogin, setUserLogin] = useState(Cookies.get("login") || "");
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [selectedOption, setSelectedOption] = useState("all");
    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [isNotesLoading, setIsNotesLoading] = useState(false);
    const [userData, setUserData] = useState();
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3010/users/${userLogin}`)
            .then((response) => response.json())
            .then((data) =>
                setUserData(() => {
                    return data.user;
                })
            )
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        setIsNotesLoading(true);

        fetch("http://localhost:3010/notes")
            .then((response) => response.json())
            .then((data) => {
                setNotes(data);
                setIsNotesLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsNotesLoading(false);
            });
    }, [showAddNoteForm]);

    useEffect(() => {
        setIsTasksLoading(true);

        userData &&
            Object.keys(userData).length > 0 &&
            fetch(
                `http://localhost:3010/tasks/${userLogin}?filter=${selectedOption}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setTasks(data);
                    setIsTasksLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setIsTasksLoading(false);
                });
    }, [showAddTaskForm, userLogin, userData, selectedOption]);

    const handleAddTaskFormChange = () => setShowAddTaskForm((prev) => !prev);
    const handleAddNoteFormChange = () => setShowAddNoteForm((prev) => !prev);

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

    const handleChangeFavorite = (taskID, isFavorite) => {
        fetch(`http://localhost:3010/tasks/favorite`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskId: taskID,
                userId: userData.id,
                isFavorite: isFavorite,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Ulubiono zadanie");
                } else {
                    console.error(
                        "Błąd podczas aktualizacji ulubionego statusu zadania"
                    );
                }
            })
            .catch((error) => {
                console.error("Błąd sieci:", error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long" };
        return date.toLocaleDateString("pl-PL", options);
    };

    return (
        <>
            <ToastContainer />
            {showAddTaskForm && (
                <AddTaskForm handleCloseForm={handleCloseForm} />
            )}
            {showAddNoteForm && (
                <AddNoteForm handleCloseForm={handleCloseForm} />
            )}
            <div className='dashboard-topbar'>
                <div className='dashboard-topbar-taskList'>
                    <input
                        type='radio'
                        id='all'
                        name='radio-filter'
                        value='all'
                        checked={selectedOption === "all"}
                        onChange={() => setSelectedOption("all")}
                    />
                    <label htmlFor='all'>Wszystkie</label>
                    <input
                        type='radio'
                        id='saved'
                        name='radio-filter'
                        value='saved'
                        checked={selectedOption === "saved"}
                        onChange={() => setSelectedOption("saved")}
                    />
                    <label htmlFor='saved'>Zapisane</label>
                    <input
                        type='radio'
                        id='completed'
                        name='radio-filter'
                        value='completed'
                        checked={selectedOption === "completed"}
                        onChange={() => setSelectedOption("completed")}
                    />
                    <label htmlFor='completed'>Wykonane</label>
                    <input
                        type='radio'
                        id='upcoming'
                        name='radio-filter'
                        value='upcoming'
                        checked={selectedOption === "upcoming"}
                        onChange={() => setSelectedOption("upcoming")}
                    />
                    <label htmlFor='upcoming'>Nadchodzące</label>
                </div>
                <div className='dashboard-topbar-menu'>
                    <button
                        className='dashboard-topbar-menu-btn'
                        onClick={() => handleShowAddTaskForm()}
                    >
                        Dodaj zadanie
                    </button>
                    <button
                        className='dashboard-topbar-menu-btn'
                        onClick={() => handleShowAddNoteForm()}
                    >
                        Dodaj notatke
                    </button>
                    <button className='dashboard-topbar-menu-minibtn'>
                        <Setting2 />
                    </button>
                    <button className='dashboard-topbar-menu-minibtn'>
                        <LogoutCurve onClick={() => onLogOut()} />
                    </button>
                </div>
            </div>
            <div className='dashboard-main'>
                <div className='dashboard-content'>
                    {!isTasksLoading ? (
                        tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Task
                                    key={task.id}
                                    header={task.name}
                                    desc={task.description}
                                    dueDate={task.due_date}
                                    createdAt={task.created_at}
                                    isFavorite={task.is_favorite}
                                    taskID={task.id}
                                    handleChangeFavorite={handleChangeFavorite}
                                />
                            ))
                        ) : (
                            <div className='no-tasks'>Brak zadań.</div>
                        )
                    ) : (
                        <div className='loader'>
                            <Waveform size={55} color='#231F20' />
                        </div>
                    )}
                </div>

                <div className='separator'></div>

                <div className='dashboard-right'>
                    <div className='dashboard-right-content'>
                        {!isNotesLoading ? (
                            notes.length > 0 ? (
                                notes.map((note) => (
                                    <Note
                                        key={note.id}
                                        header={note.name}
                                        desc={note.description}
                                        date={formatDate(note.created_at)}
                                        id={note.id}
                                    />
                                ))
                            ) : (
                                <div className='no-notes'>Brak notatek.</div>
                            )
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
