function getTwoDigitYear(str) {
    return str.substr(2, 2)
}

function getOneDigitMonth(str) {
    return (str[5] === '0' ? str.substr(6, 1) : str.substr(5, 2))
}

function getDate(str) {
    return (str.substr(8, 2))
}
function getYrMonth(str) {
    return getOneDigitMonth(str) + "/" + getTwoDigitYear(str);
}

function getMonthDate(str) {
    return getOneDigitMonth(str) + "/" + getDate(str);
}

function getDateTime(str) {
    console.log("@@@@@@@@@@@@ str = ", str);
    return getOneDigitMonth(str) + "/" + getDate(str) + "/" + getTwoDigitYear(str) + " at " + (str.substr(11, 5));
}


export { getTwoDigitYear, getOneDigitMonth, getMonthDate, getYrMonth, getDateTime }