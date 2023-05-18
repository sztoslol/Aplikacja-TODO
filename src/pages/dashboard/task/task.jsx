import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as bookmarkFiled } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as bookmarkEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import "./task.css";

const Task = ({
    header,
    desc,
    dueDate,
    createdAt,
    isFavorite,
    taskID,
    handleChangeFavorite,
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long" };
        return date.toLocaleDateString("pl-PL", options);
    };

    const calculateDaysFromDate = (fromDate) => {
        const today = new Date();
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        const timeDifference = today.getTime() - from.getTime();
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        return daysDifference;
    };

    const calculateDaysBetweenDates = (startDate, endDate) => {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        endDateObj.setHours(0, 0, 0, 0);

        const timeDifference = endDateObj.getTime() - startDateObj.getTime();
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        return daysDifference + 1;
    };

    const calculateElapsedDaysPercentage = (elapsedDays, totalDays) => {
        const percentage = (elapsedDays / totalDays) * 100;
        return percentage.toFixed(2);
    };

    const elapsedDays = calculateDaysFromDate(createdAt);
    const totalDays = calculateDaysBetweenDates(createdAt, dueDate);
    const progressPercentage = calculateElapsedDaysPercentage(
        elapsedDays,
        totalDays
    );

    let progressWidth = progressPercentage + "%";
    let taskStatus = "";

    if (elapsedDays > totalDays) {
        progressWidth = "100%";
        taskStatus = "Zakończone";
    }

    const [Favorite, setFavorite] = useState(isFavorite);

    const toggleFavorite = () => {
        setFavorite((prev) => {
            const newFavorite = prev === 1 ? 0 : 1;
            handleChangeFavorite(taskID, newFavorite);
            return newFavorite;
        });
    };

    return (
        <div className='task-main'>
            <div className='task-top'>
                <div className='task-top-header'>{header}</div>
                <div className='task-top-edit'>•••</div>
            </div>
            <div className='task-bottom'>
                <div className='task-bottom-description'>{desc}</div>

                <div className='task-bottom-countdown'>
                    {elapsedDays > totalDays
                        ? "Zakończone"
                        : `${elapsedDays}/${totalDays} dni do wykonania`}
                </div>

                <div className='task-bottom-progressbar-outer'>
                    <div
                        className='task-bottom-progressbar-inner'
                        style={{
                            width: progressWidth,
                        }}
                    ></div>
                </div>

                <div className='task-bottom-footer'>
                    <FontAwesomeIcon
                        icon={Favorite ? bookmarkFiled : bookmarkEmpty}
                        className='bookmark-icon'
                        onClick={toggleFavorite}
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
