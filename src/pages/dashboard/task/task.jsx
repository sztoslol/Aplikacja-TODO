import "./task.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const Task = ({ header, desc, dueDate, createdAt }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long" };
        return date.toLocaleDateString("pl-PL", options);
    };

    const calculateDaysFromDate = (odDaty) => {
        const dzis = new Date();
        const od = new Date(odDaty);

        const roznicaCzasu = dzis.getTime() - od.getTime();
        const roznicaDni = Math.floor(roznicaCzasu / (1000 * 60 * 60 * 24));

        return roznicaDni;
    };

    const calculateDaysBetweenDates = (dataStworzenia, deadline) => {
        const dataStworzeniaObj = new Date(dataStworzenia);
        const deadlineObj = new Date(deadline);

        const roznicaCzasu =
            deadlineObj.getTime() - dataStworzeniaObj.getTime();
        const roznicaDni = Math.floor(roznicaCzasu / (1000 * 60 * 60 * 24));

        return roznicaDni + 1;
    };

    const calculateElapsedDaysPercentage = (elapsedDays, totalDays) => {
        const percentage = (elapsedDays / totalDays) * 100;
        return percentage.toFixed(2);
    };

    console.log(
        calculateElapsedDaysPercentage(
            calculateDaysFromDate(createdAt),
            calculateDaysBetweenDates(createdAt, dueDate)
        )
    );

    return (
        <div className='task-main'>
            <div className='task-top'>
                <div className='task-top-header'>{header}</div>
                <div className='task-top-edit'>•••</div>
            </div>
            <div className='task-bottom'>
                <div className='task-bottom-description'>{desc}</div>

                <div className='task-bottom-countdown'>
                    {calculateDaysFromDate(createdAt)}
                    {"/"}
                    {calculateDaysBetweenDates(createdAt, dueDate)}
                    {" dni do wykonania"}
                </div>

                <div className='task-bottom-progressbar-outer'>
                    <div
                        className='task-bottom-progressbar-inner'
                        style={{
                            width:
                                calculateElapsedDaysPercentage(
                                    calculateDaysFromDate(createdAt),
                                    calculateDaysBetweenDates(
                                        createdAt,
                                        dueDate
                                    )
                                ) + "%",
                        }}
                    ></div>
                </div>

                <div className='task-bottom-footer'>
                    <FontAwesomeIcon
                        icon={faBookmark}
                        style={{
                            fontSize: "150%",
                            color: "#233140",
                        }}
                    />
                    <div className='task-bottom-footer-text'>
                        {formatDate(dueDate)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
