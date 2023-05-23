import "./note.css";
import { Calendar, Trash } from "iconsax-react";

const Note = ({ header, desc, date, id, handleDeleteNote }) => {
    const onDeleteNote = () => {
        handleDeleteNote(id);
    };

    return (
        <div className='note-main'>
            <div className='note-header'>{header}</div>
            <div className='note-description'>{desc}</div>
            <div className='note-footer'>
                <div className='note-footer-date'>
                    <Calendar variant='Bold' />
                    <div className='note-footer-text'>{date}</div>
                </div>
                <div
                    className='note-footer-delate'
                    onClick={() => onDeleteNote()}
                >
                    <Trash variant='Bold' />
                </div>
            </div>
        </div>
    );
};

export default Note;
