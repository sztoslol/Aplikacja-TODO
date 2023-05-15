import "./note.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const Note = ({ header, desc, date }) => {
    return (
        <div className='note-main'>
            <div className='note-header'>{header}</div>
            <div className='note-description'>{desc}</div>
            <div className='note-footer'>
                <FontAwesomeIcon icon={faPen} />
                <div className='note-footer-text'>{date}</div>
            </div>
        </div>
    );
};

export default Note;
