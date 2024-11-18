import { isValidBookingTime, calculateEndTime } from './booking';

describe('isValidBookingTime', () => {
    test('returns true for valid booking time on Monday morning', () => {
        expect(isValidBookingTime(1, '10:00')).toBe(true);
    });

    test('returns true for valid booking time on Monday afternoon', () => {
        expect(isValidBookingTime(1, '14:00')).toBe(true);
    });

    test('returns false for invalid booking time on Monday evening', () => {
        expect(isValidBookingTime(1, '18:00')).toBe(false);
    });

    test('returns false for weekend days', () => {
        expect(isValidBookingTime(0, '10:00')).toBe(false); // Sunday
        expect(isValidBookingTime(6, '10:00')).toBe(false); // Saturday
    });
});

describe('calculateEndTime', () => {
    test('calculates the correct end time for a 30-minute appointment', () => {
        expect(calculateEndTime('10:00', 30)).toBe('10:30');
    });

    test('calculates the correct end time for an hour-long appointment', () => {
        expect(calculateEndTime('11:15', 60)).toBe('12:15');
    });

    test('handles time overflow correctly', () => {
        expect(calculateEndTime('23:50', 20)).toBe('00:10');
    });
});
