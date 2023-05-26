export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("pl-PL", options);
};

export const calculateDaysFromDate = (fromDate) => {
    const today = new Date();
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    const timeDifference = today.getTime() - from.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
};

export const calculateDaysBetweenDates = (startDate, endDate) => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    const timeDifference = endDateObj.getTime() - startDateObj.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
};

export const calculateElapsedDaysPercentage = (elapsedDays, totalDays) => {
    const percentage = (elapsedDays / totalDays) * 100;
    return percentage.toFixed(2);
};
