export const isValidBookingTime = (day, time) => {
    let [hour, minute] = time.split(':').map(Number);

    switch (day) {
        case 1: // Monday
        case 2: // Tuesday
        case 3: // Wednesday
        case 4: // Thursday
        case 5: // Friday
            return (hour >= 8 && hour < 12) || (hour >= 13 && hour < 17);
        default:
            return false; // Invalid day
    }
};

export const calculateEndTime = (startTime, duration) => {
    let [hour, minute] = startTime.split(':').map(Number);
    let endTime = new Date();
    endTime.setHours(hour);
    endTime.setMinutes(minute + duration);
    return `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
};
