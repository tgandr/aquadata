// src/utils/utils.js

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const today = new Date().getTime();
    const dayStart = new Date(dateString).getTime();
    const days = Math.floor((today - dayStart) / 86400000);
    return {
        date: `${day}/${month}/${year}`,
        days: days
    };
};
