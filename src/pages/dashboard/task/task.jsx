import React from "react";
import { Calendar, ArchiveAdd, ArchiveTick, Trash, Edit2 } from "iconsax-react";
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
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj.setHours(0, 0, 0, 0);

        const timeDifference = endDateObj.getTime() - startDateObj.getTime();
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        );
        return daysDifference;
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

    if (elapsedDays >= totalDays) {
        progressWidth = "100%";
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
            <div className='task-header'>{header}</div>

            <div className='task-description'>{desc}</div>

            <div className='task-countdown'>
                {elapsedDays >= totalDays
                    ? "Zakończone"
                    : `${elapsedDays}/${totalDays} dni do wykonania`}
            </div>

            <div className='task-progressbar-outer'>
                <div
                    className='task-progressbar-inner'
                    style={{
                        width: progressWidth,
                    }}
                ></div>
            </div>

            <div className='task-footer'>
                <div className='task-footer-createdat'>
                    <Calendar variant='Bold' />
                    <div className='task-footer-text'>
                        {formatDate(dueDate)}
                    </div>
                </div>
                <div className='task-footer-edit'>
                    <div className='task-footer-edit-element'>
                        {Favorite ? (
                            <ArchiveTick
                                className='edit-icon'
                                onClick={toggleFavorite}
                                variant='Bold'
                            />
                        ) : (
                            <ArchiveAdd
                                className='edit-icon'
                                onClick={toggleFavorite}
                                variant='Bold'
                            />
                        )}
                    </div>
                    <div className='task-footer-edit-element'>
                        <Trash className='edit-icon' variant='Bold' />
                    </div>
                    <div className='task-footer-edit-element'>
                        <Edit2 className='edit-icon' variant='Bold' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
