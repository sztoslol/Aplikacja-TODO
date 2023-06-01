import "./addNoteForm.css";
import { useRef, useState } from "react";

const AddNoteForm = ({ handleCloseForm, editData, helpFn }) => {
    const dotName = useRef(null);
    const dotDescription = useRef(null);

    const errorName = useRef(null);
    const errorDescription = useRef(null);

    const [noteName, setNoteName] = useState(
        Object.keys(editData).length > 0 ? editData.name : ""
    );
    const [noteDescription, setNoteDescription] = useState(
        Object.keys(editData).length > 0 ? editData.description : ""
    );

    const handleNoteNameChange = (event) => {
        setNoteName(event.target.value);
    };

    const handleNoteDescriptionChange = (event) => {
        setNoteDescription(event.target.value);
    };

    const handleButtonClick = () => {
        if (!noteName || !noteDescription) {
            if (!noteName) {
                dotName.current.style.display = "block";
                errorName.current.style.display = "block";
                errorName.current.textContent = "Uzupełnij to pole!";
            } else {
                dotName.current.style.display = "none";
                errorName.current.style.display = "none";
            }

            if (!noteDescription) {
                dotDescription.current.style.display = "block";
                errorDescription.current.style.display = "block";
                errorDescription.current.textContent = "Uzupełnij to pole!";
            } else {
                dotDescription.current.style.display = "none";
                errorDescription.current.style.display = "none";
            }
            return;
        } else {
            if (Object.keys(editData).length <= 0) {
                fetch("http://localhost:3010/notes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: noteName,
                        description: noteDescription,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        console.log("Notatka dodana!");
                        helpFn(response.id);
                        handleCloseForm();
                    })
                    .catch((error) => {
                        console.error(
                            "There was a problem with your fetch operation:",
                            error
                        );
                    });
            } else {
                fetch(`http://localhost:3010/notes/${editData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: noteName,
                        description: noteDescription,
                    }),
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log("Notatka została zaktualizowana.");
                            helpFn(response);
                            handleCloseForm();
                        } else if (response.status === 404) {
                            console.log("Nie znaleziono notatki o podanym ID.");
                        } else {
                            console.log(
                                "Wystąpił błąd podczas aktualizacji notatki."
                            );
                        }
                    })
                    .catch((error) => {
                        console.error("Wystąpił błąd sieci:", error);
                    });
            }
        }
    };

    return (
        <div className='noteForm-main'>
            <div className='noteForm-header'>Notatka</div>
            <div className='noteForm-subheader'>
                {Object.keys(editData).length > 0
                    ? "Aby edytować notatkę wypełnij pola poniżej"
                    : "Aby dodać notatkę wypełnij pola poniżej"}
            </div>

            <div className='noteForm-input-notename'>
                <div className='noteForm-input-notename-top'>
                    <div className='noteForm-input-notename-text'>
                        Nazwa notatki
                    </div>
                    <div className='login-input-top-dot'>
                        <div className='form-error-text' ref={errorName}>
                            Debug
                        </div>
                        <div className='dot' ref={dotName}></div>
                    </div>
                </div>
                <input
                    type='text'
                    className='noteForm-notename'
                    placeholder='Przykładowa nazwa notatki'
                    value={noteName}
                    onChange={handleNoteNameChange}
                />
            </div>

            <div className='noteForm-input-desc'>
                <div className='noteForm-input-notedesc-top'>
                    <div className='noteForm-input-desc-text'>Opis notatki</div>
                    <div className='login-input-top-dot'>
                        <div className='form-error-text' ref={errorDescription}>
                            Debug
                        </div>
                        <div className='dot' ref={dotDescription}></div>
                    </div>
                </div>
                <textarea
                    type='text'
                    className='noteForm-desc'
                    placeholder='Przykładowy opis notatki'
                    value={noteDescription}
                    onChange={handleNoteDescriptionChange}
                />
            </div>

            <button
                className='noteForm-button'
                type='button'
                onClick={() => handleButtonClick()}
            >
                Potwierdź
            </button>
        </div>
    );
};

export default AddNoteForm;
