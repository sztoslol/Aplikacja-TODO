import "./task.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as bookmarkNotFilled } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as bookmarkFilled } from "@fortawesome/free-solid-svg-icons";

const Task = ({ header, desc, dueDate }) => {
    return (
        <div className='task-main'>
            <div className='task-top'>
                <div className='task-top-header'>{header}</div>
                <div className='task-top-edit'>•••</div>
            </div>
            <div className='task-bottom'>
                <div className='task-bottom-description'>{desc}</div>

                <div className='task-bottom-countdown'>
                    {"7/14 dni do wykonania"}
                </div>

                <div className='task-bottom-progressbar-outer'>
                    <div
                        className='task-bottom-progressbar-inner'
                        style={{ width: "50%" }}
                    ></div>
                </div>

                <div className='task-bottom-footer'>
                    <FontAwesomeIcon
                        icon={bookmarkFilled}
                        style={{
                            fontSize: "150%",
                            color: "#233140",
                            cursor: "pointer",
                        }}
                    />
                    <div className='task-bottom-footer-text'>{dueDate}</div>
                </div>
            </div>
        </div>
    );
};

export default Task;
