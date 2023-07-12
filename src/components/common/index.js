import Geocode from 'react-geocode';
import { API_KEY } from '../../config/Config'
import Parser from 'html-react-parser';
import Moment from 'moment';
import moment from 'moment'


/**
 * @method displayDateTimeFormate
 * @description used for display date or tome formate conditionally
 */
export function displayDateTimeFormate(date) {
    let localTime = Moment.utc(date).local().format();
    // return Moment(date).startOf('miniute').fromNow()
    return Moment(localTime).local().startOf('miniute').fromNow()
}

export function expireDate(date) {
    console.log('days date',date)
    const now = Moment.utc();
    const exp = Moment.utc(date);
    console.log(exp.format());
    let days = exp.diff(now, 'days');
    let hours = exp.subtract(days, 'days').diff(now, 'hours');
    let minutes = exp.subtract(hours, 'hours').diff(now, 'minutes');
    console.log('days left', days)
    if(days > 0){
        return days
    }else {
        return ''
    }
}

export function displayCalenderDate(date) {
    return Moment.utc(date).format('Do MMMM, dddd')
}

/* 21 Feb 2021 */
export function dateFormat4(date) {
    return Moment.utc(date).format('DD MMM YYYY')
}

export function displayInspectionDate(date) {
    return Moment.utc(date).format('dddd DD MMMM, YYYY')
}

export function displayDate(date) {
    return Moment.utc(date).format('D')
}


/* Sun, 19 Jan - Tue, 14 Jan */
export function dateFormate(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('ddd, Do MMM');
}

/* Sun, 19 Jan - Tue, 14 Jan */
export function dateFormate7(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('Do MMM YYYY');
}



/* 11:22 AM */
export function startTime(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('hh:mm a');
}


/* 15/12/2020 DD/MM/YYYY */
export function dateFormate1(date) {
    return Moment.utc(date).format('DD/MM/YYYY');
    // return Moment.utc(date).format('MMM Do');
}

/* Nov 25 - Dec 23 */
export function dateFormate2(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('MMM DD');
}

/* 12 Sun Dec 11:22 AM */
export function dateFormate3(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('DD ddd MMM hh:mm A');
}

/* 12 Sun Dec 11:22 AM */
export function dateFormate4(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('DD/MM/YY hh:mm A');
}

/* Nov 2020 - Dec 2020 */
export function dateFormate5(date) {
    // return Moment.utc(date).format('ddd, Do MMM');
    return Moment.utc(date).format('YYYY');
}

/* 2 Jan 21  */
export function dateFormate6(date) {
    return Moment.utc(date).format('DD MMM YY');
    // return Moment.utc(date).format('MMM Do');
}

// "1,234,567,890"
export function salaryNumberFormate(value) {
    let number = parseInt(value)
    let text = number ? String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,') : '0'
    let run = text.startsWith('$')
    if (run) {
        return String(number.toFixed(2)).replace(/(.)(?=(\d{3})+$)/g, '$1,').substring(1)
    } else {
        return number ? String(number.toFixed(2)).replace(/(.)(?=(\d{3})+$)/g, '$1,') : '0'
    }

}

/**
 * @method getLocation
 * @description get latitude and longitude
 */
export const getLocation = () => {
    const mapObj = window.navigator;
    let lat, long, address = '';
    if (mapObj.geolocation) {
        mapObj.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getAddress(lat, long)

            getAddress(lat, long, res => {
                address = res
            })

        })
        return address
    } else {
        alert('Geolocation is not supported by this browser.')
    }
}


/**
 * @method convertISOToUtcDateformate
 * @description convert date in formate
 */
export function convertISOToUtcDateformate(date) {
    return Moment.utc(date).format('DD-MM-YYYY');
}

/**
 * @method getAddress
 * @description get address
 */
export const getAddress = (latitude, longitude, callback) => {

    Geocode.setApiKey(API_KEY);
    // Get address from latidude & longitude.
    Geocode.fromLatLng(latitude, longitude).then(
        response => {
            const address = response.results[0].formatted_address;
            callback(response.results[0])

        },
        error => {

            callback('')
        }
    );
}


/**
 * @method converInUpperCase
 * @description convert first letter in uppercase
 */
export const converInUpperCase = (name) => {
    if (name === null || name === undefined) return ''
    // return `${name[0].toUpperCase()}${name.slice(1)}`;
    return name.split(' ').map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(' ')
}

/**
 * @method capitalizeFirstLetter
 * @description convert first letter in uppercase
 */
export const capitalizeFirstLetter = (string) => {
    if (string === '' || string === null || string === undefined) {
        return ''
    } else {
        let data = string.toLowerCase()
        return data.split(' ').map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(' ')

        // return string && string[0].toUpperCase() + string.slice(1).toLowerCase();
        // return string.split(' ').map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(' ')
    }
}

export const validFileType = (file) => {

    let validType = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'txt' || file.type === 'rtf' || file.type === 'text/plain';
    if (validType) {
        return true
    } else {
        return false
    }
}

export const validFileSize = (file) => {
    // const validSize = Math.round(file.size / (1024 * 1024)) < 2
    const validSize = file.size < 2000000;

    if (validSize) {
        return true
    } else {
        return false
    }
}

/**
 * @method convertHTMLToText
 * @description convert html to text
 */
export const convertHTMLToText = (description) => {
    if (description === null || description === undefined) return description
    return Parser(description)
}

/**
 * @method formateTime
 * @description formate time
 */
export const formateTime = (timeString) => {
    if (timeString === null) {
        return ''
    } else {
        var hourEnd = timeString.indexOf(':');
        var H = +timeString.substr(0, hourEnd);

        var h = H % 12 || 12;
        var ampm = (H < 12 || H === 24) ? 'am' : 'pm';
        timeString = h + timeString.substr(hourEnd, 3) + ' ' + ampm;
        return timeString
    }
}

/**
 * @method formateTime
 * @description formate time
 */
export const formatedTime = (timeString) => {
    if (timeString === null) {
        return ''
    } else {
        var hourEnd = timeString.indexOf(':');
        var H = +timeString.substr(0, hourEnd);
        var h = H % 12 || 12;
        var ampm = (H < 12 || H === 24) ? 'am' : 'pm';
        timeString = h + timeString.substr(hourEnd, 3) + ' ' + ampm;
        return timeString
    }
}

/**
 * @method getDaysFullName
 * @description get day by number
 */
export const getDaysFullName = (number) => {
    if (number === 1) {
        return 'Monday'
    } else if (number === 2) {
        return 'Tuesday'
    } else if (number === 3) {
        return 'Wednesday'
    } else if (number === 4) {
        return 'Thursday'
    } else if (number === 5) {
        return 'Friday'
    } else if (number === 6) {
        return 'Saturday'
    } else if (number === 7) {
        return 'Sunday'
    }
}

/**
 * @method getDaysName
 * @description get day by number
 */
 export const getDaysName = (number) => {
    if (number === 1) {
        return 'Mon'
    } else if (number === 2) {
        return 'Tue'
    } else if (number === 3) {
        return 'Wed'
    } else if (number === 4) {
        return 'Thu'
    } else if (number === 5) {
        return 'Fri'
    } else if (number === 6) {
        return 'Sat'
    } else if (number === 7) {
        return 'Sun'
    }
}

function endOfWeek(date) {
    var lastday = date.getDate() - (date.getDay() - 1) + 6;
    return new Date(date.setDate(lastday));
}

function convertDateformate(date) {
    return Moment.utc(date).format('DD/MM/YYYY');
}

/**
 * @method getThisWeekend
 * @description get this weekend date
 */
export const getThisWeekend = () => {
    let today = new Date();
    return Moment.utc(endOfWeek(today).toString()).format('DD/MM/YYYY')
}

/**
 * @method getNextMonth
 * @description get next month date
 */
export const getNextMonth = () => {
    let today = new Date();
    today =  today.getMonth() + 2
    return new Date(moment(new Date()).add(today+1, "days"))
}

/**
 * @method getThisWeek
 * @description get this week date
 */
export const getThisWeek = () => {
    var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
    today = new Date();
    todayNumber = today.getDay();
    mondayNumber = 1 - todayNumber;
    sundayNumber = 7 - todayNumber;
    monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
    sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + sundayNumber);
    monday = convertDateformate(monday)
    sunday = convertDateformate(sunday)
    var this_week = {
        monday,
        sunday
    }
    return this_week
}

/**
 * @method getNextWeek
 * @description get next week date
 */
export const getNextWeek = () => {
    let today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toUTCString();
    return convertDateformate(nextweek)
}

/**
 * @method currentDate
 * @description get current date
 */
export const currentDate = () => {
    return convertDateformate(Date.now());
}

/**
 * @method getThisMonthDates
 * @description get this month dates
 */
export const getThisMonthDates = () => {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let fday = convertDateformate(firstDay)
    let lday = convertDateformate(lastDay)
    let this_month = {
        fday,
        lday
    }
    return this_month
}


export const convertMinToHours = (timeInMinutes) => {
    var hrs = Math.floor(timeInMinutes / 60);
    // Getting the minutes. 
    var min = timeInMinutes % 60;
    if (hrs < 0) {
        return min + "Minutes";
    } else {
        return hrs + " Hour(s) " + min + " Minute(s)";
    }
}

export const convertTime12To24Hour = (time12hour) => {
    return Moment(time12hour, ["h:mm A"]).format("HH:mm");
}

export const convertTime24To12Hour = (time24hour) => {
    return Moment(time24hour, ["HH:mm"]).format("LT");
}

export const calculateHoursDiffBetweenDates = (dateToCheck) => {

    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    // Get your start and end date/times
    const cuurentDateTime = Moment().format(dateFormat);

    var ms = Moment(dateToCheck, "YYYY-MM-DD HH:mm:ss").diff(Moment(cuurentDateTime, "YYYY-MM-DD HH:mm:ss"));
    var d = Moment.duration(ms);
    return d.asHours();
}

/**
  * @method blankCheck
  * @description Blanck check of undefined & not null
  */
export const blankCheck = (value, withDash = false) => {
    if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '' && value !== 'undefined') {

        return withDash ? `- ${value}` : value
    } else {
        return ''
    }
}

export const roundToTwo = (value) => { 
    let num = Number(value)   
    return num.toFixed(2)
}


export const splitDescription = (description) => {
    if (description && description.length > 25) {
        return description.substring(0, 25) + "..."
    } else {
        return description
    }
}

export const displayTitle = (text) => {
    if(text){
        return text.replace(/\r?\n|\r/g, "");
    }else {
        return text
    }
};

export const createRandomString = () => {
    const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const random_string = [...Array(5)]
    .map((_) => c[~~(Math.random() * c.length)])
    .join("");
    return `${random_string}`
}

export const createRandomAlphaString = () => {
    const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const random_string = [...Array(10)]
    .map((_) => c[~~(Math.random() * c.length)])
    .join("");
    return `${random_string}`
}

export const  hoursToMinutes = (h,minute) => {
    let hours = Math.trunc(minute/60);
    let minutes = minute % 60;
    let totalHours = Number(hours) + Number(h)
    if (totalHours !== undefined && totalHours !== null && minutes !== undefined && minutes !== null ) {
        return `${totalHours}h ${minutes}m`
    }else {
        return ''
    }
}

export const getTimeDifference = (date1, date2) => {
    var d1, d2;  
    d1 = new Date(date1);
    d2 = new Date(date2);
    var res = Math.abs(d1 - d2) / 1000;
    // get total days between two dates
    var days = Math.floor(res / 86400);                    
    // get hours        
    var hours = Math.floor(res / 3600) % 24;         
    // get minutes
    var minutes = Math.floor(res / 60) % 60;
    return {
        hours, minutes
    }
}

export const blankValueCheck  = (value) => {
    if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '' && value !== 'undefined') {
        return value 
    }else {return  ''}
}

export const removeNumberFromString = (string) => {
    if(string){
        let n = string.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "").split(" ");
        let updated_string = n[n.length - 1];
        let temp = string.replace(updated_string,'')
        let formate_string = temp.replace('-', '')
        return formate_string
    }else {
        return ''
    }
}






