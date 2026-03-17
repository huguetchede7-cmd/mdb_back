import { parse, compareAsc, format as dateFnsFormat, format } from 'date-fns';
import { LogHelpers } from './LogHelpers';
import { fr } from 'date-fns/locale'

type DateComparisonParams = {
    dateFrom: string;
    dateFromFormat?: string;
    dateTo?: string;
    dateToFormat?: string;
};

/**
 * Compares two dates and returns -1, 0, or 1.
 *
 * @param {Date} secondaryDate - The secondary date to compare with. Defaults to the current date.
 * @param {string | Date} dateToTest - The date to be tested.
 * @returns {number} - 0 if equal, 1 if dateToTest is later, -1 if earlier.
 */
export const compareDates = (secondaryDate: Date = new Date(), dateToTest: string | Date): number => {
    const date1 = new Date(dateToTest);
    const date2 = new Date(secondaryDate);

    if (date1.getTime() === date2.getTime()) {
        return 0;
    } else if (date1 > date2) {
        return 1;
    } else {
        return -1;
    }
}

/**
 * Generates an array of month-year strings from a starting month/year to the current month/year.
 *
 * @param {number} startMonth - The starting month (1-based).
 * @param {number} startYear - The starting year.
 * @returns {string[]} - Array of month-year strings.
 */
export const generateMonths = (startMonth: number, startYear: number): string[] => {
    const months: string[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const startDate = new Date(startYear, startMonth - 1); // Months are 0-based in JavaScript
    const currentDate = new Date();

    while (startDate <= currentDate) {
        const month = monthNames[startDate.getMonth()];
        const year = startDate.getFullYear();
        months.push(`${month} ${year}`);

        // Move to the next month
        startDate.setMonth(startDate.getMonth() + 1);
    }

    return months;
}

/**
 * Merges two datasets into a single object by month-year, with default values set to 0.
 *
 * @param {string[]} emptyData - Array of month-year strings to initialize with.
 * @param {Array<{ monthYear: string; totalAmount: string | number }>} filledData - Array of data to merge.
 * @returns {{ [key: string]: number }} - Object with month-year keys and aggregated values.
 */
export const mergeMonthlyData = (
    emptyData: string[],
    filledData: { monthYear: string; totalAmount: string | number }[]
): { [key: string]: number } => {
    const finalArray: { [key: string]: number } = {};

    emptyData.forEach(element => {
        finalArray[element] = 0;
    });

    if (filledData.length > 0) {
        filledData.forEach(data => {
            if (!finalArray[data.monthYear]) {
                finalArray[data.monthYear] = 0;
            }
            finalArray[data.monthYear] += parseFloat(data.totalAmount.toString());
        });
    }

    return finalArray;
}

/**
 * Compares two dates based on the provided formats and returns -1, 0, or 1.
 *
 * @param {DateComparisonParams} params - The parameters for the comparison.
 * @returns {number} - -1 if dateFrom is before dateTo, 1 if after, and 0 if equal.
 */
export const compareDatesTo = ({
    dateFrom,
    dateFromFormat = "dd MMM yyyy HH:mm",
    dateTo,
    dateToFormat = "dd MMM yyyy HH:mm"
}: DateComparisonParams): number => {
    const specificDateFrom = dateFrom ? parse(dateFrom, dateFromFormat, new Date()) : new Date();
    const specificDateTo = dateTo ? parse(dateTo, dateToFormat, new Date()) : new Date();
    return compareAsc(specificDateFrom, specificDateTo);
}


export const isCurrentMonth =(date: Date): boolean => {
    const now = new Date();
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
    );
}

export const formatToMonthYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

/**
 * Formats a date string or Date object to a specified format using date-fns
 * 
 * @param {Date | string} date - The date to format
 * @param {string} formatStr - The desired output format (defaults to "dd MMM yyyy HH:mm")
 * @returns {string} The formatted date string
 */
export const formatDateHelpers = (date: Date | string, formatStr: string = "dd MMM. yyyy HH:mm"): string => {
    try {
        let dateToFormat: Date;

        if (date instanceof Date) {
            dateToFormat = date;
        } else {
            // Try to parse the string date
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date");
            }
            dateToFormat = parsedDate;
        }

        return dateFnsFormat(dateToFormat, formatStr);
    } catch (error) {
        LogHelpers.showException(error as Error);
        return dateFnsFormat(new Date(), formatStr);
    }
}


export const formatDateFr =(dateString: string|Date, newFormat: string = "dd MMM yyyy "):string=>  {
  const date = new Date(dateString);
  return format(date, newFormat,{ locale: fr });
}

export const parseDateFromQuery = (val: unknown): Date | null => {
  if (!val || typeof val !== 'string') return null;
  const replaced = val.replace(' ', 'T');
  const d = new Date(replaced);
  return isNaN(d.getTime()) ? null : d;
}
