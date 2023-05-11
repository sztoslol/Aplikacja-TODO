import "./note.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const Note = () => {
    return (
        <div className='note-main'>
            <div className='note-header'>{"Tekst notatki"}</div>
            <div className='note-description'>
                {
                    "To tylko przykładowy tekst notatki. W notatkach można pisać tylko to co żywnie ci się podoba. Pozdrawiam wszystkich cieplutko."
                }
            </div>
            <div className='note-footer'>
                <FontAwesomeIcon icon={faPen} />
                <div className='note-footer-text'>{"24 marzec"}</div>
            </div>
        </div>
    );
};

export default Note;
