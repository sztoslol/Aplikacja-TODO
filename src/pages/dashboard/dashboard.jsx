import { ToastContainer, toast } from "react-toastify";
import AddTaskForm from "./addTaskForm/addTaskForm";
import AddNoteForm from "./addNoteForm/addNoteForm";
import Task from "./task/task";
import Note from "./note/note";
import { Setting2, LogoutCurve } from "iconsax-react";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";

/*
    Obłsuga formularzy(w tym dodanie danych do bazy) znajduje się w ich komponentach
*/

const Dashboard = ({ onLogOut, userData, goToSettings }) => {
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [selectedOption, setSelectedOption] = useState("all");
    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [isNotesLoading, setIsNotesLoading] = useState(false);
    const [renderIndexTasks, setRenderIndexTask] = useState(0);
    const [renderIndexNote, setRenderIndexNote] = useState(0);
    const [deletedNoteId, setDeletedNoteId] = useState(null);
    const [deletedTaskId, setDeletedTaskId] = useState(null);
    const [editDataNote, setEditDataNote] = useState({});
    const [editDataTask, setEditDataTask] = useState({});
    const [editNoteId, setEditNoteId] = useState(0);
    const [editTaskId, setEditTaskId] = useState(0);
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setIsNotesLoading(true);

        fetch("http://localhost:3010/notes")
            .then((response) => response.json())
            .then((data) => {
                setNotes(data);
                setIsNotesLoading(false);
                setRenderIndexNote(0);
            })
            .catch((error) => {
                console.error(error);
                setIsNotesLoading(false);
            });
    }, [editNoteId, deletedNoteId]);

    useEffect(() => {
        setIsTasksLoading(true);

        userData &&
            Object.keys(userData).length > 0 &&
            fetch(
                `http://localhost:3010/tasks/${userData.login}?filter=${selectedOption}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setTasks(data);
                    setIsTasksLoading(false);
                    setRenderIndexTask(0);
                })
                .catch((error) => {
                    console.error(error);
                    setIsTasksLoading(false);
                });
    }, [editTaskId, selectedOption, deletedTaskId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderIndexTask((prevIndex) => prevIndex + 1);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [renderIndexTasks]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderIndexNote((prevIndex) => prevIndex + 1);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [renderIndexNote]);

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

        setEditDataNote({});
        setEditDataTask({});
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

    const handleDeleteNote = (noteID) => {
        fetch(`http://localhost:3010/notes/${noteID}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Notatka została pomyślnie usunięta");
                    setDeletedNoteId(noteID);
                } else {
                    console.log("Wystąpił błąd podczas usuwania notatki");
                    setDeletedNoteId(noteID);
                    toast.error("Błąd podczas archwizowania", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((error) => {
                console.error("Wystąpił błąd sieci:", error);
            });
    };

    const handleDeleteTask = (taskID) => {
        fetch(`http://localhost:3010/tasks/${taskID}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Zadanie zostało pomyślnie uzunięte");
                    setDeletedTaskId(taskID);
                } else {
                    console.log("Wystąpił błąd podczas usuwania zadania");
                }
            })
            .catch((error) => {
                console.error("Wystąpił błąd sieci: ", error);
            });
    };

    const editNote = (data) => {
        setEditDataNote(data);
        handleShowAddNoteForm();
    };

    const editTask = (data) => {
        setEditDataTask(data);
        handleShowAddTaskForm();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long" };
        return date.toLocaleDateString("pl-PL", options);
    };

    const helpNotes = (id) => {
        setEditNoteId(id);
    };

    const helpTasks = (id) => {
        setEditTaskId(id);
    };

    return (
        <>
            <ToastContainer />
            {showAddTaskForm && (
                <AddTaskForm
                    handleCloseForm={handleCloseForm}
                    editData={editDataTask}
                    helpFn={helpTasks}
                />
            )}
            {showAddNoteForm && (
                <AddNoteForm
                    handleCloseForm={handleCloseForm}
                    editData={editDataNote}
                    helpFn={helpNotes}
                />
            )}
            <div className='dashboard-topbar'>
                <div className='dashboard-topbar-taskList'>
                    <input
                        type='radio'
                        id='all'
                        name='radio-filter'
                        value='all'
                        checked={selectedOption === "all"}
                        onChange={() => {
                            setSelectedOption("all");
                            setRenderIndexTask(0);
                        }}
                    />
                    <label htmlFor='all'>Wszystkie</label>
                    <input
                        type='radio'
                        id='saved'
                        name='radio-filter'
                        value='saved'
                        checked={selectedOption === "saved"}
                        onChange={() => {
                            setSelectedOption("saved");
                            setRenderIndexTask(0);
                        }}
                    />
                    <label htmlFor='saved'>Zapisane</label>
                    <input
                        type='radio'
                        id='completed'
                        name='radio-filter'
                        value='completed'
                        checked={selectedOption === "completed"}
                        onChange={() => {
                            setSelectedOption("completed");
                            setRenderIndexTask(0);
                        }}
                    />
                    <label htmlFor='completed'>Wykonane</label>
                    <input
                        type='radio'
                        id='upcoming'
                        name='radio-filter'
                        value='upcoming'
                        checked={selectedOption === "upcoming"}
                        onChange={() => {
                            setSelectedOption("upcoming");
                            setRenderIndexTask(0);
                        }}
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
                    {userData.role === "admin" && (
                        <button
                            className='dashboard-topbar-menu-minibtn'
                            onClick={() => goToSettings()}
                        >
                            <Setting2 />
                        </button>
                    )}
                    <button
                        className='dashboard-topbar-menu-minibtn'
                        onClick={() => onLogOut()}
                    >
                        <LogoutCurve />
                    </button>
                </div>
            </div>
            <div className='dashboard-main'>
                <div className='dashboard-content'>
                    {!isTasksLoading &&
                        (tasks.length > 0 ? (
                            tasks
                                .slice(0, renderIndexTasks)
                                .map((task, index) => (
                                    <Task
                                        index={index}
                                        header={task.name}
                                        desc={task.description}
                                        dueDate={task.due_date}
                                        createdAt={task.created_at}
                                        userRole={userData.role}
                                        isFavorite={task.is_favorite}
                                        taskID={task.id}
                                        handleChangeFavorite={
                                            handleChangeFavorite
                                        }
                                        handleDeleteTask={handleDeleteTask}
                                        handleEditTask={editTask}
                                    />
                                ))
                        ) : (
                            <div className='no-tasks'>Brak zadań.</div>
                        ))}
                </div>

                <div className='separator'></div>

                <div className='dashboard-right'>
                    <div className='dashboard-right-content'>
                        {!isNotesLoading &&
                            (notes.length > 0 ? (
                                notes
                                    .slice(0, renderIndexNote)
                                    .map((note) => (
                                        <Note
                                            key={note.id}
                                            header={note.name}
                                            desc={note.description}
                                            date={formatDate(note.created_at)}
                                            id={note.id}
                                            handleDeleteNote={handleDeleteNote}
                                            handleEditNote={editNote}
                                        />
                                    ))
                            ) : (
                                <div className='no-notes'>Brak notatek.</div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
