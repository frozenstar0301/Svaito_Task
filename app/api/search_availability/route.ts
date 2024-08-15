import { NextResponse } from 'next/server';

// Mock API URL
const MOCK_API_URL = 'https://66b357b77fba54a5b7ec89d3.mockapi.io/api/v1/availabilities';

// Utility function to check if a year is a leap year
const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

// Utility function to get days in a month
const daysInMonth = (month: number, year: number) => {
    const daysInMonthMap: { [key: number]: number } = {
        1: 31, 2: isLeapYear(year) ? 29 : 28, 3: 31, 4: 30, 5: 31,
        6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };
    return daysInMonthMap[month];
};

// Function to validate date format
const validateDate = (date: string) => {
    const [year, month, day] = date.split("-");
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    // Check if the date contains year, month, and day components
    if (!year || !month || !day) {
        return "Incomplete date. Please provide the date in the format YYYY-MM-DD.";
    }

    // Validate year format
    if (year.length !== 4 || isNaN(yearNum)) {
        return "Invalid year format. Please provide a valid year (e.g., 2024).";
    }
    // Validate month format
    if (month.length !== 2 || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return "Invalid month format. Please provide a valid month (01-12).";
    }
    // Validate day format
    if (day.length !== 2 || isNaN(dayNum) || dayNum < 1 || dayNum > daysInMonth(monthNum, yearNum)) {
        return `Invalid day format. Please provide a valid day (01-${daysInMonth(monthNum, yearNum)}).`;
    }
    
    // Additional validation for correct format
    const inputDate = new Date(date);
    const expectedDate = new Date(`${year}-${month}-${day}`);
    if (inputDate.toISOString().startsWith(date)) {
        return null;
    }
    return "Invalid date format. Please provide the date in the format YYYY-MM-DD.";
};

export async function POST(request: Request) {
    try {
        const { date } = await request.json();

        // Validate if a date is provided
        if (!date) {
            return NextResponse.json({
                message: "No date provided. Please provide a date.",
                isValid: false,
                errorType: "missing",
            });
        }

        // Check if the date is in the past
        const inputDate = new Date(date);
        const now = new Date();
        if (inputDate < now) {
            return NextResponse.json({
                message: "The date is in the past. Please select a future date.",
                isValid: false,
                errorType: "past_date",
            });
        }

        // Validate date format
        const validationError = validateDate(date);
        if (validationError) {
            return NextResponse.json({
                message: validationError,
                isValid: false,
                errorType: "invalid_date",
            });
        }

        // Fetch availability data from the mock API
        const response = await fetch(MOCK_API_URL);
        const data = await response.json();

        // Filter slots for the requested date
        const bookedSlots = data.filter((slot: any) => slot.start.startsWith(date));

        // Extract times of booked slots
        const bookedTimes = bookedSlots.map((slot: any) => {
            const time = new Date(slot.start).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
            return time;
        });

        // Filter for 18 holes availability
        const eighteenHolesSlots = bookedSlots.filter((slot: any) =>
            slot.tags.includes('18holes')
        );

        const eighteenHolesTimes = eighteenHolesSlots.map((slot: any) => {
            const time = new Date(slot.start).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
            return time;
        });

        const availabilityMessage = bookedTimes.length
            ? `Anytime is available except for ${bookedTimes.join(', ')}.`
            : 'Anytime you want is available.';

        const eighteenHolesMessage = eighteenHolesTimes.length
            ? `18 holes availability is limited to times outside of ${eighteenHolesTimes.join(', ')}.`
            : '18 holes is fully available.';

        return NextResponse.json({
            message: availabilityMessage,
            eighteenHolesMessage,
            isValid: true,
            errorType: "",
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json({
            message: 'An error occurred. Please try again later.',
            isValid: false,
            errorType: "server",
        }, { status: 500 });
    }
}
