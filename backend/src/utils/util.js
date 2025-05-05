// A sample utility function to format dates
export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Another sample utility function to capitalize a string
export function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

    const isFirefox = typeof InstallTrigger !== 'undefined';

    // Check if the dateString is in the format "Tue Sep 17 2024 00:00:00 GMT+0530"
    const fullDateRegex = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{2}\s\d{4}/;

    // Full date format handling
    if (fullDateRegex.test(dateString)) {
        const parts = dateString.split(' ');
        const day = parseInt(parts[2], 10);
        const year = parseInt(parts[3], 10);

        const monthName = parts[1];
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthName);

        if (monthIndex === -1) {
            throw new Error('Invalid month in date string');
        }

        // Handle Safari and Firefox separately due to timezone issues
        if (isSafari || isFirefox) {
            return new Date(year, monthIndex, day); // Avoid timezone issues
        }

        // Other browsers
        return new Date(Date.parse(dateString)); // Standard parsing for Chrome and others
    }

    // Otherwise, assume the dateString is in "MM-DD-YYYY" format
    try {
        const parsedDate = Date.parse(dateString, 'MM-dd-yyyy', new Date());

        // Return the parsed date or handle special cases for Safari and Firefox
        if (isSafari || isFirefox) {
            const [month, day, year] = dateString.split(separator).map(Number);
            return new Date(year, month - 1, day); // Manual construction for Safari/Firefox
        }

        return parsedDate;
    } catch (error) {
        throw new Error('Invalid date format');
    }
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

    const isFirefox = typeof InstallTrigger !== 'undefined';

    // Check if the dateString is in the format "Tue Sep 17 2024 00:00:00 GMT+0530"
    const fullDateRegex = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{2}\s\d{4}/;

    // Full date format handling
    if (fullDateRegex.test(dateString)) {
        const parts = dateString.split(' ');
        const day = parseInt(parts[2], 10);
        const year = parseInt(parts[3], 10);

        const monthName = parts[1];
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthName);

        if (monthIndex === -1) {
            throw new Error('Invalid month in date string');
        }

        // Handle Safari and Firefox separately due to timezone issues
        if (isSafari || isFirefox) {
            return new Date(year, monthIndex, day); // Avoid timezone issues
        }

        // Other browsers
        return new Date(Date.parse(dateString)); // Standard parsing for Chrome and others
    }

    // Otherwise, assume the dateString is in "MM-DD-YYYY" format
    try {
        const parsedDate = Date.parse(dateString, 'MM-dd-yyyy', new Date());

        // Return the parsed date or handle special cases for Safari and Firefox
        if (isSafari || isFirefox) {
            const [month, day, year] = dateString.split(separator).map(Number);
            return new Date(year, month - 1, day); // Manual construction for Safari/Firefox
        }

        return parsedDate;
    } catch (error) {
        throw new Error('Invalid date format');
    }
};

window.formatmdyDate = (dateString, separator = '-') => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}${separator}${day}${separator}${year}`;
};

window.formatMDate = (date) => {
    date = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()]; // Get the name of the day
    const monthName = months[date.getMonth()]; // Get the name of the month
    const day = date.getDate(); // Get the day of the month

    return `${dayName}, ${monthName} ${day}`;
};

window.formatDate2 = (dateString) => {
    const date = parseDateString(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString(undefined, options);
};

window.scrollToError = (event) => {
    setTimeout(() => {
        const firstErrorElement = document.querySelector('.error');

        if (firstErrorElement) {
            const offset = 200; // Adjust this value to increase or decrease the top offset
            const elementPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
        }
    },200)
}
