import React from "react";
import {
    formatDate,
    calculateDaysFromDate,
    calculateDaysBetweenDates,
    calculateElapsedDaysPercentage,
} from "../../../utils/dateUtils.js";
import { Calendar, ArchiveAdd, ArchiveTick, Trash, Edit2 } from "iconsax-react";
import { useState } from "react";
import "./task.css";

const Task = ({
    taskID,
    header,
    desc,
    dueDate,
    createdAt,
    userRole,
    isFavorite,
    handleChangeFavorite,
    handleDeleteTask,
    handleEditTask,
}) => {
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

    const onDeleteTask = () => {
        handleDeleteTask(taskID);
    };

    const onEditTask = () => {
        handleEditTask({
            id: taskID,
            name: header,
            description: desc,
            due_date: dueDate,
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
                    {userRole === "admin" && (
                        <>
                            <div className='task-footer-edit-element'>
                                <Trash
                                    className='edit-icon'
                                    variant='Bold'
                                    onClick={() => onDeleteTask(taskID)}
                                />
                            </div>
                            <div className='task-footer-edit-element'>
                                <Edit2
                                    className='edit-icon'
                                    variant='Bold'
                                    onClick={() => onEditTask()}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Task;
