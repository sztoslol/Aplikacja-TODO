import "./addTaskForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const AddTaskForm = () => {
    const [dropdownVisibility, setdropdownVisibility] = useState("none");

    const handleChangeDropdown = () => {
        setdropdownVisibility((prev) => {
            if (prev === "none") return "block";
            else return "none";
        });
    };

    const text = "Monika Napierała, Jarosław Napierała";
    const truncatedText = text.length > 30 ? text.slice(0, 30) + "..." : text;

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
                />
            </div>

            <div className='taskForm-input-desc'>
                <div className='taskForm-input-desc-text'>Opis zadania</div>
                <textarea
                    type='text'
                    className='taskForm-desc'
                    placeholder='Przykładowy opis zadania'
                />
            </div>

            <div className='taskForm-dropdown'>
                <div className='taskForm-dropdown-header'>Osoby</div>
                <div
                    className='taskForm-dropdown-main'
                    onClick={() => handleChangeDropdown()}
                >
                    {truncatedText}
                    <div className='taskForm-dropdown-main-icon'>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                </div>
                <div
                    className='taskForm-dropdown-users'
                    style={{ display: dropdownVisibility }}
                >
                    <div className='taskForm-dropdown-element'>
                        Adam admin{" "}
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className='dropdown-icon'
                        />
                    </div>
                    <div className='taskForm-dropdown-element'>
                        Generał napierał
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className='dropdown-icon'
                        />
                    </div>
                </div>
            </div>

            <button className='taskForm-button' type='button'>
                Potwierdź
            </button>
        </div>
    );
};

export default AddTaskForm;
