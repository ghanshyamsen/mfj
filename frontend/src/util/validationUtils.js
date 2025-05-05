// src/validationUtils.js

// String Validations
window.hasWhitespace = (str) => /\s/.test(str);
window.isLength = (str, min, max) => str.length >= min && str.length <= max;
window.isEmpty = (str) => !str || str.trim().length === 0;
window.isString = (value) => typeof value === 'string';
window.isEmptyString = (str) => window.isString(str) && str.trim() === '';
window.isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/i.test(str);
window.isAlpha = (str) => /^[a-zA-Z]+$/i.test(str);
window.isNumeric = (str) => /^[0-9]+$/.test(str);
window.isNumeric2 = (str) => !isNaN(str);
window.isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
window.isURL = (str) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(str);
window.isIP = (str) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str);
window.isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
window.isHexColor = (str) => /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.test(str);
window.isLowerCase = (str) => str === str.toLowerCase();
window.isUpperCase = (str) => str === str.toUpperCase();
// window.isBase64 = (str) => /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{2}==)?$/i.test(str);
window.isJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};
window.isPalindrome = (str) => {
    const cleaned = str.replace(/[\W_]/g, '').toLowerCase();
    return cleaned === cleaned.split('').reverse().join('');
};
window.isPostalCode = (str, countryCode = 'US') => {
    const regex = {
        US: /^\d{5}(-\d{4})?$/,
        UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
        CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
        AU: /^\d{4}$/,
    };
    return regex[countryCode] ? regex[countryCode].test(str) : false;
};
window.isCreditCard = (str) => /^[0-9]{13,19}$/.test(str);
window.isPhoneNumber = (str, countryCode = 'US') => {
    const regex = {
        US: /^\+?1?\d{10,14}$/,
        UK: /^\+?44?\d{10,13}$/,
        IN: /^\+?91?\d{10}$/,
    };
    return regex[countryCode] ? regex[countryCode].test(str) : false;
};
window.isStrongPassword = (str) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(str);

// Number Validations
window.isNumber = (value) => typeof value === 'number';
window.isInteger = (value) => Number.isInteger(value);
window.isPositive = (value) => window.isNumber(value) && value > 0;
window.isNegative = (value) => window.isNumber(value) && value < 0;
window.isEven = (value) => window.isNumber(value) && value % 2 === 0;
window.isOdd = (value) => window.isNumber(value) && value % 2 !== 0;
window.isInRange = (value, min, max) => window.isNumber(value) && value >= min && value <= max;
window.isDivisibleBy = (value, divisor) => window.isNumber(value) && value % divisor === 0;
window.isPrime = (value) => {
    if (value <= 1 || !window.isInteger(value)) return false;
    for (let i = 2, sqrt = Math.sqrt(value); i <= sqrt; i++) {
        if (value % i === 0) return false;
    }
    return true;
};
window.isFloat = (value) => window.isNumber(value) && !Number.isInteger(value);
window.isFiniteNumber = (value) => window.isNumber(value) && isFinite(value);
window.isNaNValue = (value) => Number.isNaN(value);
window.isSafeInteger = (value) => Number.isSafeInteger(value);

// Array Validations
window.isArray = (value) => Array.isArray(value);
window.isEmptyArray = (arr) => window.isArray(arr) && arr.length === 0;
window.isArrayLength = (arr, length) => window.isArray(arr) && arr.length === length;
window.isArrayIncludes = (arr, value) => window.isArray(arr) && arr.includes(value);
window.isArrayUnique = (arr) => window.isArray(arr) && new Set(arr).size === arr.length;
window.isArraySorted = (arr) => window.isArray(arr) && arr.every((v, i, a) => !i || a[i - 1] <= v);
window.isArrayOfType = (arr, type) => window.isArray(arr) && arr.every(item => typeof item === type);
window.isArrayDeepEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);
window.isArraySubset = (arr1, arr2) => arr2.every(val => arr1.includes(val));
window.isArrayIntersect = (arr1, arr2) => arr1.some(val => arr2.includes(val));

// Object Validations
window.isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
window.isEmptyObject = (obj) => window.isObject(obj) && Object.keys(obj).length === 0;
window.isObjectKey = (obj, key) => window.isObject(obj) && obj.hasOwnProperty(key);
window.isObjectKeysLength = (obj, length) => window.isObject(obj) && Object.keys(obj).length === length;
window.isObjectOfType = (obj, type) => window.isObject(obj) && Object.values(obj).every(value => typeof value === type);
window.isObjectDeepEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
window.isObjectHasKeys = (obj, keys) => window.isObject(obj) && keys.every(key => obj.hasOwnProperty(key));
window.isObjectInstanceOf = (obj, constructor) => obj instanceof constructor;
window.isObjectFrozen = (obj) => Object.isFrozen(obj);
window.isObjectSealed = (obj) => Object.isSealed(obj);

// Date Validations
window.isDate = (value) => value instanceof Date && !isNaN(value);
window.isValidDate = (str) => !isNaN(Date.parse(str));
window.isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
window.isBeforeDate = (date1, date2) => new Date(date1) < new Date(date2);
window.isAfterDate = (date1, date2) => new Date(date1) > new Date(date2);
window.isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};
window.isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
};
window.isWeekday = (date) => !window.isWeekend(date);
window.isDateInRange = (date, start, end) => {
    const d = new Date(date);
    return d >= new Date(start) && d <= new Date(end);
};
window.isTimeFormat = (time, format = 'HH:mm') => {
    const regex = {
        'HH:mm': /^([01]\d|2[0-3]):([0-5]\d)$/,
        'HH:mm:ss': /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
        'hh:mm A': /^(0?[1-9]|1[0-2]):([0-5]\d) ([APap][mM])$/,
    };
    return regex[format] ? regex[format].test(time) : false;
};

// Boolean Validations
window.isBoolean = (value) => typeof value === 'boolean';
window.isTrue = (value) => value === true;
window.isFalse = (value) => value === false;

// Miscellaneous Validations
window.isDefined = (value) => value !== undefined;
window.isUndefined = (value) => value === undefined;
window.isNull = (value) => value === null;
window.isFalsy = (value) => !value;
window.isTruthy = (value) => !!value;
window.isFunction = (value) => typeof value === 'function';
window.isPromise = (value) => window.isFunction(value?.then);
window.isRegExp = (value) => value instanceof RegExp;
window.isSymbol = (value) => typeof value === 'symbol';
window.isBigInt = (value) => typeof value === 'bigint';
window.isMap = (value) => value instanceof Map;
window.isSet = (value) => value instanceof Set;
window.isWeakMap = (value) => value instanceof WeakMap;
window.isWeakSet = (value) => value instanceof WeakSet;
window.isInstance = (value, constructor) => value instanceof constructor;
window.isError = (value) => value instanceof Error;
window.isNaNValue = (value) => Number.isNaN(value);
window.isFiniteNumber = (value) => window.isNumber(value) && isFinite(value);

//File validation

// Checks if a file is of a specific MIME type
window.isMimeType = (file, mimeType) => file.type === mimeType;

// Checks if a file has a specific extension
window.hasFileExtension = (file, extension) => {
    const fileExt = file.name.split('.').pop();
    return fileExt.toLowerCase() === extension.toLowerCase();
};

// Checks if a file size is within the allowed range (in bytes)
window.isFileSizeInRange = (file, minSize, maxSize) => {
    const fileSize = file.size; // Size in bytes
    return fileSize >= minSize && fileSize <= maxSize;
};

// Checks if a file is a valid image based on MIME type
window.isImageFile = (file) =>
    window.isMimeType(file, 'image/jpeg') ||
    window.isMimeType(file, 'image/png') ||
    window.isMimeType(file, 'image/gif');

// Checks if a file is a valid PDF based on MIME type
window.isPDFFile = (file) => window.isMimeType(file, 'application/pdf');

// Checks if a file is a valid audio file based on MIME type
window.isAudioFile = (file) =>
    window.isMimeType(file, 'audio/mpeg') ||
    window.isMimeType(file, 'audio/wav');

// Checks if a file is a valid video file based on MIME type
window.isVideoFile = (file) =>
    window.isMimeType(file, 'video/mp4') ||
    window.isMimeType(file, 'video/avi');

// Checks if a file's extension matches its MIME type
window.isValidFileType = (file) => {
    const mimeTypeToExt = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'application/pdf': 'pdf',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'video/mp4': 'mp4',
        'video/avi': 'avi'
    };
    const expectedExt = mimeTypeToExt[file.type];
    if (!expectedExt) return true; // No expected extension for this MIME type
    return window.hasFileExtension(file, expectedExt);
};

// Checks if the file extension is valid based on a list of allowed extensions
window.isValidExtension = (file, allowedExtensions) => {
    const fileExt = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExt);
};

// Checks if the file MIME type is valid based on a list of allowed MIME types
window.isValidMimeType = (file, allowedMimeTypes) => allowedMimeTypes.includes(file.type);


// Ensure minimum is less than or equal to maximum
window.isMinLessThanMax = (min, max) => min <= max;

// Ensure a start date/time is before an end date/time
window.isStartBeforeEnd = (startDate, endDate) => new Date(startDate) < new Date(endDate);

// Validate if a number is within a range (inclusive)
window.isNumberInRange = (number, min, max) => number >= min && number <= max;

// Validate if a string length is within a range (inclusive)
window.isStringLengthInRange = (str, minLength, maxLength) => str.length >= minLength && str.length <= maxLength;

// Check if a value is a positive number
window.isPositiveNumber = (value) => typeof value === 'number' && value > 0;

// Check if a value is a non-negative number
window.isNonNegativeNumber = (value) => typeof value === 'number' && value >= 0;

// Check if a date is in the past
window.isDateInPast = (date) => new Date(date) < new Date();

// Check if a date is in the future
window.isDateInFuture = (date) => new Date(date) > new Date();

// Check if a value is a valid URL
window.isValidURL = (value) => {
    try {
        new URL(value);
        return true;
    } catch (_) {
        return false;
    }
};

// Check if a string matches a specific pattern
window.matchesPattern = (value, pattern) => pattern.test(value);

// Validate if a string is a valid JSON
window.isValidJSON = (value) => {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
};

// Validate if an object has required keys
window.hasRequiredKeys = (obj, requiredKeys) => requiredKeys.every(key => key in obj);

// Check if a file is of a certain size and type (combined check)
window.isFileValid = (file, { minSize, maxSize, allowedTypes }) => {
    return (
        window.isFileSizeInRange(file, minSize, maxSize) &&
        window.isValidMimeType(file, allowedTypes)
    );
};

window.detectMimeType = async (file) => {

    const buffer = await file.arrayBuffer();

    const arr = new Uint8Array(buffer).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    switch (header) {
      case "25504446":
        return "application/pdf"; // PDF
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
      case "ffd8ffe3":
      case "ffd8ffe8":
        return "image/jpeg"; // JPEG
      case "89504e47":
        return "image/png"; // PNG
      case "47494638":
        return "image/gif"; // GIF
      case "49492a00":
        return "image/tiff"; // TIFF
      case "424d":
        return "image/bmp"; // BMP
      case "52494646":
        return "video/avi"; // AVI (Audio Video Interleave)
      case "1a45dfa3":
        return "video/webm"; // WebM
      case "000001ba":
      case "000001b3":
        return "video/mpeg"; // MPEG
      case "66747970":
        return "video/mp4"; // MP4
      case "4f676753":
        return "audio/ogg"; // OGG
      case "494433":
        return "audio/mp3"; // MP3 (ID3 header for MP3)
      case "52617221":
        return "application/x-rar-compressed"; // RAR archive
      case "1f8b08":
        return "application/gzip"; // GZIP
      case "cafebabe":
        return "application/java-archive"; // Java Class File
      case "d0cf11e0":
        return "application/msword"; // DOC (Microsoft Word)
      case "504b34":
      case "504b0304":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // DOCX (Word)
      case "252150532d41646f6265":
        return "application/postscript"; // PostScript
      case "3c3f786d6c":
        return "application/xml"; // XML
      case "3c21444f43545950452068746d6c":
        return "text/html"; // HTML
      case "00000018":
      case "00000020":
        return "video/mp4"; // MP4 (QuickTime)
      case "425a68":
        return "application/x-bzip2"; // BZ2
      case "377abcaf":
        return "application/x-7z-compressed"; // 7z
      default:
        return "unknown";
    }
};
