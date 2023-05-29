import "./addTaskForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTaskForm = ({ handleCloseForm, editData }) => {
    const [taskData, setTaskData] = useState({
        name: editData.name || "",
        description: editData.description || "",
        due_date: editData.due_date ? new Date(editData.due_date) : null,
        target_users: editData.target_users || [],
    });

    const [dropdownVisibility, setdropdownVisibility] = useState("none");
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3010/users")
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);

                if (Object.keys(editData).length > 0) {
                    fetch(`http://localhost:3010/tasks/${editData.id}/users`)
                        .then((response) => response.json())
                        .then((data) => {
                            setTaskData({ ...taskData, target_users: data });
                            setIsLoaded(true);
                        })
                        .catch((error) => console.error(error));
                } else {
                    setIsLoaded(true);
                }
            })
            .catch((error) => console.error(error));
    }, [editData]);

    const handleAddTask = () => {
        fetch("http://localhost:3010/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error adding task");
                }
                console.log("Task added successfully");
                handleCloseForm();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleEditTask = () => {
        fetch(`http://localhost:3010/tasks/${editData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Zadanie zostało zaktualizowane.");
                    handleCloseForm();
                } else if (response.status === 404) {
                    console.log("Nie znaleziono zadania o podanym ID.");
                } else {
                    console.log("Wystąpił błąd podczas aktualizacji zadania.");
                }
            })
            .catch((error) => {
                console.error("Wystąpił błąd sieci:", error);
            });
    };

    const truncatedText = (text) => {
        return text.length > 30 ? text.slice(0, 30) + "..." : text;
    };

    if (!isLoaded) {
        return null;
    }

    const handleChangeDropdown = () => {
        setdropdownVisibility((prev) => {
            if (prev === "none") return "block";
            else return "none";
        });
    };

    const handleNameInputChange = (event) => {
        setTaskData((prevState) => ({
            ...prevState,
            name: event.target.value,
        }));
    };

    const handleDescriptionInputChange = (event) => {
        setTaskData((prevState) => ({
            ...prevState,
            description: event.target.value,
        }));
    };

    const handleDue_dateInputChange = (date) => {
        setTaskData((prevState) => ({
            ...prevState,
            due_date: date,
        }));
    };

    const handleTargetUserClick = (user) => {
        const { target_users } = taskData;
        const updatedUsers = target_users.includes(user)
            ? target_users.filter((u) => u !== user)
            : [...target_users, user];

        setTaskData((prevTaskData) => ({
            ...prevTaskData,
            target_users: updatedUsers,
        }));
    };

    const handleCheckData = () => {};

    return (
        <div className='taskForm-main'>
            <div className='taskForm-header'>Zadanie</div>
            <div className='taskForm-subheader'>
                Aby dodać zadanie wypełnij pola poniżej
            </div>
            <div className='taskForm-input-taskname'>
                <div className='taskForm-input-taskname-text'>
                    Nazwa zadania
                </div>
                <input
                    type='text'
                    className='taskForm-taskname'
                    placeholder='Przykładowa nazwa zadania'
                    value={taskData.name}
                    onChange={handleNameInputChange}
                />
            </div>

            <div className='taskForm-input-desc'>
                <div className='taskForm-input-desc-text'>Opis zadania</div>
                <textarea
                    type='text'
                    className='taskForm-desc'
                    placeholder='Przykładowy opis zadania'
                    value={taskData.description}
                    onChange={handleDescriptionInputChange}
                />
            </div>

            <div className='datepicker-outer'>
                <div className='datepicker-header'>Data wykonania</div>
                <ReactDatePicker
                    selected={taskData.due_date}
                    onChange={handleDue_dateInputChange}
                    className='datepicker'
                    dateFormat='yyyy-MM-dd'
                    placeholderText='Wybierz datę wykonania'
                />
            </div>

            <div className='taskForm-dropdown'>
                <div className='taskForm-dropdown-header'>Osoby</div>
                <div
                    className='taskForm-dropdown-main'
                    onClick={() => handleChangeDropdown()}
                >
                    {taskData.target_users.length <= 0
                        ? "Wybierz osoby"
                        : truncatedText(taskData.target_users.join(", "))}
                    <div className='taskForm-dropdown-main-icon'>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                </div>
                <div
                    className='taskForm-dropdown-users'
                    style={{ display: dropdownVisibility }}
                >
                    {users.length > 0 &&
                        users.map((user) => (
                            <div
                                className={`taskForm-dropdown-element ${
                                    taskData.target_users.includes(user.login)
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleTargetUserClick(user.login)
                                }
                                key={user.login}
                            >
                                {user.login}
                                <FontAwesomeIcon
                                    icon={faCirclePlus}
                                    className='dropdown-icon'
                                />
                            </div>
                        ))}
                </div>
            </div>

            <button
                className='taskForm-button'
                type='button'
                onClick={() => {
                    Object.keys(editData).length > 0
                        ? handleEditTask()
                        : handleAddTask();
                }}
            >
                Potwierdź
            </button>
        </div>
    );
};

export default AddTaskForm;
