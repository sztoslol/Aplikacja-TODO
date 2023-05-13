import "./addNoteForm.css";
import { useRef, useState } from "react";

const AddNoteForm = ({ handleAddNote }) => {
    const [noteName, setNoteName] = useState("");
    const [noteDescription, setNoteDescription] = useState("");

    const handleNoteNameChange = (event) => {
        setNoteName(event.target.value);
    };

    const handleNoteDescriptionChange = (event) => {
        setNoteDescription(event.target.value);
    };

    const handleButtonClick = () => {
        if (!noteName) {
        }

        if (!noteDescription) {
        }
    };

    return (
        <div className='noteForm-main'>
            <div className='noteForm-header'>Notatka</div>
            <div className='noteForm-subheader'>
                Aby dodać notatkę wypełnij pola poniżej
            </div>

            <div className='noteForm-input-notename'>
                <div className='noteForm-input-notename-text'>
                    Nazwa notatki
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
                <div className='noteForm-input-desc-text'>Opis notatki</div>
                <textarea
                    type='text'
                    className='noteForm-desc'
                    placeholder='Przykładowy opis notatki'
                    value={noteDescription}
                    onChange={handleNoteDescriptionChange}
                />
            </div>

            <button className='noteForm-button' type='button'>
                Potwierdź
            </button>
        </div>
    );
};

export default AddNoteForm;
