import { toast, Bounce } from 'react-toastify';

import OpenAI from 'openai';


window.isSubscribed = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if(userData.subscription_status){
        return userData.subscription_status;
    }else{

        const isUpcoming = new Date(userData.subscription_next_payment_date) >= new Date();

        if(userData.plan_key!=='free_plan' && isUpcoming){
            return true;
        }
    }

    return false;
}

window.isAge13OrOlder = (dateOfBirth) => {
    const today = new Date();
    const dob = new Date(dateOfBirth);

    // Calculate age difference
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age >= 13;
}

window.ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

window.formatToTwoDecimalPlaces = (number) => {
    // Convert the number to a string
    const numberString = number.toString();

    // Check if the number has a decimal point
    if (numberString.includes('.')) {
        // Format to two decimal places
        let nnumber =  parseFloat(number);

        return (numberString.split('.')?.[1]?.length > 2)?nnumber.toFixed(2):nnumber;
    } else {
        // No decimal point, return as is or append ".00"
        return number; // Returns a string with ".00"
    }
}

window.showToast = (message, type = 'default', options = {}) => {
    const config = {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:(localStorage.getItem('theme') && localStorage.getItem('theme')==="dark"?"light":"dark"),
        transition: Bounce
    };

    switch (type) {
        case 'success':
            toast.success(message, config);
        break;
        case 'error':
            toast.error(message, config);
        break;
        case 'info':
            toast.info(message, config);
        break;
        case 'warn':
            toast.warn(message, config);
        break;
        default:
            toast(message, config);
        break;
    }
};

window.trimHTMLToText = (html)  => {
    // Create a temporary DOM element to hold the HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Extract and return the text content
    return doc.body.textContent || doc.body.innerText || '';
}

const parseDateString = (dateString, separator = '-') => {
    // Detect browser (simple user-agent detection)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const isFullDateFormat = !isNaN(Date.parse(dateString));

    if(isSafari){
        if (isFullDateFormat) {
            // If dateString is in the full date format, parse it directly
            return new Date(dateString);
        }

        // Otherwise, assume the dateString is in the format "month-day-year"
        const parts = dateString.split(separator).map(Number);

        if (parts.length !== 3 || parts.some(isNaN)) {
            // If the split parts are not valid numbers, throw an error or handle it accordingly
            throw new Error('Invalid date format');
        }

        const [month, day, year] = parts;

        // Construct a new Date object (month is 0-based, so subtract 1)
        return new Date(year, month - 1, day);
    }

    return new Date(dateString);
};

window.parseDateString = (dateString, separator = '-') => {
    // Detect browser (simple user-agent detection)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const isFullDateFormat = !isNaN(Date.parse(dateString));

    if(isSafari){
        if (isFullDateFormat) {
            // If dateString is in the full date format, parse it directly
            return new Date(dateString);
        }

        // Otherwise, assume the dateString is in the format "month-day-year"
        const parts = dateString.split(separator).map(Number);

        if (parts.length !== 3 || parts.some(isNaN)) {
            // If the split parts are not valid numbers, throw an error or handle it accordingly
            throw new Error('Invalid date format');
        }

        const [month, day, year] = parts;

        // Construct a new Date object (month is 0-based, so subtract 1)
        return new Date(year, month - 1, day);
    }

    return new Date(dateString);
};

window.formatMDate = (inputDate) => {
    let date;

    // Check if input is a string in the format "YYYY-MM-DD"
    if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
        // Split the date string to extract year, month, and day
        const [year, month, day] = inputDate.split('-').map(Number);
        // Create the date using local time (Note: month is zero-indexed, so subtract 1)
        date = new Date(year, month - 1, day);
    } else {
        // If input is already a Date object or another format, just create a new Date from it
        date = new Date(inputDate);
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()]; // Get the name of the day
    const monthName = months[date.getMonth()]; // Get the name of the month
    const dayOfMonth = date.getDate(); // Get the day of the month

    return `${dayName}, ${monthName} ${dayOfMonth}`;
};

window.formatmdyDate = (dateString, separator = '-') => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}${separator}${day}${separator}${year}`;
};

window.formatMDate_ = (date) => {
    date = new Date(date);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()]; // Get the name of the day
    const monthName = months[date.getMonth()]; // Get the name of the month
    const day = date.getDate(); // Get the day of the month

    return `${dayName}, ${monthName} ${day}`;
};

window.formatDate = (dateString) => {
    const date = parseDateString(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString(undefined, options);
};

window.timeAgo = (date) => {
    const diff = Math.abs(parseDateString(date) - new Date()); // Difference in milliseconds
    const seconds = Math.floor(diff / 1000); // Convert to seconds
    const minutes = Math.floor(seconds / 60); // Convert to minutes
    const hours = Math.floor(minutes / 60); // Convert to hours
    const days = Math.floor(hours / 24); // Convert to days
    const years = Math.floor(days / 365); // Convert to years

    if (years > 0) return `${years}y`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    if (seconds > 0) return `${seconds}s`;
    return 'just now';
}

window.timeDiff = (startdate, enddate) => {
    const diff = Math.abs(parseDateString(enddate) - parseDateString(startdate)); // Difference in milliseconds
    const seconds = Math.floor(diff / 1000); // Convert to seconds
    const minutes = Math.floor(seconds / 60); // Convert to minutes
    // const hours = Math.floor(minutes / 60); // Convert to hours
    // const days = Math.floor(hours / 24); // Convert to days
    // const years = Math.floor(days / 365); // Convert to years

    if (minutes > 0) return `${minutes}`;

    return 'just now';
}

window.getOpenAIResponse = async (prompt) => {
    try {
        const client = new OpenAI({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true, // This allows browser usage, be cautious in production
        });

        const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o', // Change 'gpt-4o' to 'gpt-4' as per your requirement
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        throw error;
    }
};


// src/utils.js

// String Functions
window.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
window.camelCase = (str) => str.replace(/-./g, match => match.charAt(1).toUpperCase());
window.kebabCase = (str) => str.replace(/\s+/g, '-').toLowerCase();
window.snakeCase = (str) => str.replace(/\s+/g, '_').toLowerCase();
window.reverseString = (str) => str.split('').reverse().join('');
window.isPalindrome = (str) => str === str.split('').reverse().join('');
window.truncate = (str, len) => str.length > len ? str.slice(0, len) + '...' : str;
window.countWords = (str) => str.trim().split(/\s+/).length;
window.escapeHTML = (str) => str.replace(/[&<>"']/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[tag] || tag));
window.unescapeHTML = (str) => str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, tag => ({'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"}[tag] || tag));

// Array Functions
window.arrayUnique = (arr) => [...new Set(arr)];
window.arrayFlatten = (arr) => arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? window.arrayFlatten(toFlatten) : toFlatten), []);
window.arrayChunk = (arr, size) => arr.length ? [arr.slice(0, size), ...window.arrayChunk(arr.slice(size), size)] : [];
window.arrayRemove = (arr, value) => arr.filter(item => item !== value);
window.arraySum = (arr) => arr.reduce((sum, num) => sum + num, 0);
window.arrayAverage = (arr) => window.arraySum(arr) / arr.length;
window.arrayMax = (arr) => Math.max(...arr);
window.arrayMin = (arr) => Math.min(...arr);
window.arrayDifference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
window.arrayIntersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));

// Object Functions
window.objectDeepClone = (obj) => JSON.parse(JSON.stringify(obj));
window.objectMerge = (obj1, obj2) => ({ ...obj1, ...obj2 });
window.objectKeys = (obj) => Object.keys(obj);
window.objectValues = (obj) => Object.values(obj);
window.objectEntries = (obj) => Object.entries(obj);
window.objectFromEntries = (entries) => Object.fromEntries(entries);
window.objectHasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
window.objectPick = (obj, keys) => keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
window.objectOmit = (obj, keys) =>
    Object.keys(obj).reduce((acc, key) => {
      if (!keys.includes(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
window.objectIsEmpty = (obj) => Object.keys(obj).length === 0;
window.valueExistsArray = (array, value) => array.includes(value);

// Number Functions
window.isEven = (num) => num % 2 === 0;
window.isOdd = (num) => num % 2 !== 0;
window.isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};
window.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
window.randomFloat = (min, max) => Math.random() * (max - min) + min;
window.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
window.roundTo = (num, places) => +(Math.round(num + `e+${places}`) + `e-${places}`);
window.toCurrency = (num, currency = 'USD') => num.toLocaleString('en-US', { style: 'currency', currency });

// Date Functions
window.formatDate2 = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const hours24 = d.getHours();
    const hours12 = hours24 % 12 || 12; // Convert to 12-hour format and handle midnight (0)
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const map = {
        YYYY: d.getFullYear(),
        MM: (`0${d.getMonth() + 1}`).slice(-2),
        DD: (`0${d.getDate()}`).slice(-2),
        HH: (`0${hours24}`).slice(-2),        // 24-hour format
        hh: (`0${hours12}`).slice(-2),        // 12-hour format
        mm: (`0${d.getMinutes()}`).slice(-2),
        ss: (`0${d.getSeconds()}`).slice(-2),
        A: ampm
    };

    return format.replace(/YYYY|MM|DD|HH|hh|mm|ss|A/gi, matched => map[matched]);
};
window.addDays = (date, days) => new Date(date.setDate(date.getDate() + days));
window.subtractDays = (date, days) => new Date(date.setDate(date.getDate() - days));
window.startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
window.endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));
window.isWeekend = (date) => [0, 6].includes(new Date(date).getDay());
window.daysBetween = (date1, date2) => Math.ceil((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
window.formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };
    for (const [unit, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
};



// Utility Functions
window.noop = () => {};
window.identity = (x) => x;
window.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
window.debounce = (fn, delay) => {
    let timeoutID;
    return (...args) => {
        if (timeoutID) clearTimeout(timeoutID);
        timeoutID = setTimeout(() => fn(...args), delay);
    };
};
window.throttle = (fn, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
        const context = this;
        if (!lastRan) {
            fn.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if (Date.now() - lastRan >= limit) {
                    fn.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};
window.cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
window.uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
window.memoize = (fn) => {
    const cache = {};
    return (...args) => {
        const key = JSON.stringify(args);
        if (!cache[key]) {
            cache[key] = fn(...args);
        }
        return cache[key];
    };
};

// Type Checking Functions
window.isObject = (value) => value && typeof value === 'object' && value.constructor === Object;
window.isArray = (value) => Array.isArray(value);
window.isString = (value) => typeof value === 'string' || value instanceof String;
window.isNumber = (value) => typeof value === 'number' && isFinite(value);
window.isBoolean = (value) => typeof value === 'boolean';
window.isFunction = (value) => typeof value === 'function';
window.isNull = (value) => value === null;
window.isUndefined = (value) => typeof value === 'undefined';
window.isDate = (value) => value instanceof Date;
window.isRegExp = (value) => value instanceof RegExp;
window.isSymbol = (value) => typeof value === 'symbol';
window.isError = (value) => value instanceof Error;


// src/moreUtils.js

// String Functions
window.strContains = (str, substr) => str.includes(substr);
window.strStartsWith = (str, prefix) => str.startsWith(prefix);
window.strEndsWith = (str, suffix) => str.endsWith(suffix);
window.strRepeat = (str, times) => str.repeat(times);
window.strPadLeft = (str, length, char = ' ') => str.padStart(length, char);
window.strPadRight = (str, length, char = ' ') => str.padEnd(length, char);
window.strSlugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w]+/g, '');
window.strTrim = (str) => str.trim();
window.strTrimLeft = (str) => str.trimStart();
window.strTrimRight = (str) => str.trimEnd();
window.strToUpper = (str) => str.toUpperCase();
window.strToLower = (str) => str.toLowerCase();
window.strShuffle = (str) => str.split('').sort(() => Math.random() - 0.5).join('');
window.strRandom = (length) => Array(length).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
window.strWordCount = (str) => str.split(/\s+/).length;
window.strUcwords = (str) => str.replace(/\b[a-z]/g, char => char.toUpperCase());
window.strStr = (haystack, needle) => haystack.includes(needle) ? haystack.substring(haystack.indexOf(needle)) : false;
window.strReplace = (search, replace, subject) => subject.split(search).join(replace);
window.strReplaceArray = (search, replace, subject) => search.reduce((acc, val, i) => acc.split(val).join(replace[i] || ''), subject);
window.strSubstring = (str, start, length) => str.substr(start, length);

// Array Functions
window.arrayMerge = (arr1, arr2) => arr1.concat(arr2);
window.arrayFill = (value, length) => Array(length).fill(value);
window.arrayReverse = (arr) => arr.slice().reverse();
window.arraySort = (arr, compareFn) => arr.slice().sort(compareFn);
window.arrayFilter = (arr, callback) => arr.filter(callback);
window.arrayMap = (arr, callback) => arr.map(callback);
window.arrayReduce = (arr, callback, initialValue) => arr.reduce(callback, initialValue);
window.arrayFind = (arr, callback) => arr.find(callback);
window.arrayFindIndex = (arr, callback) => arr.findIndex(callback);
window.arraySome = (arr, callback) => arr.some(callback);
window.arrayEvery = (arr, callback) => arr.every(callback);
window.arrayIncludes = (arr, value) => arr.includes(value);
window.arrayConcatAll = (arrays) => [].concat(...arrays);
window.arrayCountValues = (arr) =>
    arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
window.arrayNth = (arr, n) => arr[n >= 0 ? n : arr.length + n];
window.arrayIndexOf = (arr, value) => arr.indexOf(value);
window.arrayLastIndexOf = (arr, value) => arr.lastIndexOf(value);
window.arrayHead = (arr) => arr[0];
window.arrayTail = (arr) => arr.slice(1);
window.arrayLast = (arr) => arr[arr.length - 1];
window.arrayCompact = (arr) => arr.filter(Boolean);

// Object Functions
window.objectAssign = (target, ...sources) => Object.assign(target, ...sources);
window.objectFreeze = (obj) => Object.freeze(obj);
window.objectSeal = (obj) => Object.seal(obj);
window.objectIsFrozen = (obj) => Object.isFrozen(obj);
window.objectIsSealed = (obj) => Object.isSealed(obj);
window.objectIsExtensible = (obj) => Object.isExtensible(obj);
window.objectExtend = (obj1, obj2) => ({ ...obj1, ...obj2 });
window.objectToPairs = (obj) => Object.entries(obj);
window.objectFromPairs = (pairs) => Object.fromEntries(pairs);
window.objectFilter = (obj, callback) => Object.fromEntries(Object.entries(obj).filter(([key, value]) => callback(value, key)));
window.objectMap = (obj, callback) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value, key)]));
window.objectReduce = (obj, callback, initialValue) => Object.entries(obj).reduce((acc, [key, value]) => callback(acc, value, key), initialValue);
window.objectDeepFreeze = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Object.isFrozen(obj[key])) {
            window.objectDeepFreeze(obj[key]);
        }
    });
    return obj;
};
window.objectDeepMerge = (target, source) => {
    for (let key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], window.objectDeepMerge(target[key], source[key]));
        }
    }
    return Object.assign(target || {}, source);
};
window.objectDeepEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
window.objectInvert = (obj) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
window.objectGet = (obj, path, defaultValue) => path.split('.').reduce((o, p) => o ? o[p] : defaultValue, obj);

// Number Functions
window.isFloat = (num) => Number(num) === num && num % 1 !== 0;
window.isInt = (num) => Number(num) === num && num % 1 === 0;
window.isNegative = (num) => num < 0;
window.isPositive = (num) => num > 0;
window.roundUp = (num, precision = 0) => Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision);
window.roundDown = (num, precision = 0) => Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision);
window.toFixed = (num, digits) => num.toFixed(digits);
window.toPrecision = (num, precision) => num.toPrecision(precision);
window.randomBetween = (min, max) => Math.random() * (max - min) + min;
window.randomSign = () => Math.random() < 0.5 ? -1 : 1;
window.factorial = (num) => num <= 1 ? 1 : num * window.factorial(num - 1);
window.fibonacci = (num) => num <= 1 ? num : window.fibonacci(num - 1) + window.fibonacci(num - 2);
window.lcm = (a, b) => Math.abs(a * b) / window.gcd(a, b);
window.gcd = (a, b) => !b ? a : window.gcd(b, a % b);
window.isPowerOfTwo = (num) => (Math.log2(num) % 1 === 0);
window.isPowerOfTen = (num) => (Math.log10(num) % 1 === 0);
window.logBase = (num, base) => Math.log(num) / Math.log(base);
window.toExponential = (num, fractionDigits) => num.toExponential(fractionDigits);
window.hexToDecimal = (hex) => parseInt(hex, 16);
window.decimalToHex = (decimal) => decimal.toString(16);
window.binaryToDecimal = (binary) => parseInt(binary, 2);
window.decimalToBinary = (decimal) => decimal.toString(2);

// Date Functions
window.dateToday = () => new Date().toISOString().slice(0, 10);
window.dateTomorrow = () => window.addDays(new Date(), 1).toISOString().slice(0, 10);
window.dateYesterday = () => window.subtractDays(new Date(), 1).toISOString().slice(0, 10);
window.isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
window.getDayOfWeek = (date) => new Date(date).getDay();
window.getWeekOfYear = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
};
window.getMonthName = (date) => new Date(date).toLocaleString('default', { month: 'long' });
window.getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
window.isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};
window.addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
window.subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
};
window.addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};
window.subtractMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
};
window.addYears = (date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
};
window.subtractYears = (date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() - years);
    return result;
};
window.timeNow = () => new Date().toLocaleTimeString();
window.timeAddHours = (date, hours) => new Date(new Date(date).setHours(new Date(date).getHours() + hours));
window.timeSubtractHours = (date, hours) => new Date(new Date(date).setHours(new Date(date).getHours() - hours));

// Miscellaneous Functions
window.cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
window.isEqual = (value1, value2) => JSON.stringify(value1) === JSON.stringify(value2);
window.parseJSON = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return fallback;
    }
};
window.stringifyJSON = (obj, space = 2) => JSON.stringify(obj, null, space);
window.uniqueID = (prefix = '') => prefix + Math.random().toString(36).substr(2, 9);
window.generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
});
let timeout;
window.debounce2 = (func, wait, immediate) => {
    return function() {
        const context = this, args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

window.convertUrlsToLinks = (text)  => {
    // Regular expression to match URLs (supports http, https, www)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

    // Replace matched URLs with anchor tags
    return text.replace(urlRegex, (url) => {
      // Add http:// to URLs starting with www
      const link = url.startsWith('www.') ? `http://${url}` : url;

      return `<a href="${link}" target="_blank">${url}</a>`;
    });
}

window.createSlug = (value)  => {
    if (typeof value !== "string") {
      // Convert non-string values to a string
      value = String(value);
    }

    return value
      .trim() // Remove leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .normalize("NFD") // Normalize accents/diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[/\\]/g, "-") // Replace slashes (both / and \) with dashes
      .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/-+/g, "-") // Replace multiple dashes with a single dash
      .replace(/^-|-$/g, ""); // Remove leading and trailing dashes
}
