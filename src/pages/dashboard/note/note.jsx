import "./note.css";
import { Calendar, Trash, Edit2 } from "iconsax-react";
import "animate.css";

const Note = ({ header, desc, date, id, handleDeleteNote, handleEditNote }) => {
    const onDeleteNote = () => {
        handleDeleteNote(id);
    };

    const onEditNote = () => {
        handleEditNote({
            id: id,
            name: header,
            description: desc,
            createdAt: date,
        });
    };

    return (
        <div className='note-main animate__animated animate__fadeInRight'>
            <div className='note-header'>{header}</div>
            <div className='note-description'>{desc}</div>
            <div className='note-footer'>
                <div className='note-footer-date'>
                    <Calendar variant='Bold' />
                    <div className='note-footer-text'>{date}</div>
                </div>
                <div className='note-footer-delate'>
                    <Trash
                        variant='Bold'
                        style={{ marginRight: "5px" }}
                        onClick={() => onDeleteNote()}
                    />
                    <Edit2 variant='Bold' onClick={() => onEditNote()} />
                </div>
            </div>
        </div>
    );
};

export default Note;
