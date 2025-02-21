import dayjs from 'dayjs';
import db from '..';
import { borrowRecords } from '../schema';
import { eq } from 'drizzle-orm';

interface borrowBookParams {
    bookId: string;
    userId: string;
    day?: number;
}

function borrowBookAddRecord({ bookId, userId, day = 7 }: borrowBookParams) {
    const dueDate = dayjs().add(day, 'day').toDate().toDateString();

    return db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
        status: 'BORROWED'
    });
}

function returnBorrowBook(borrowRecordId: string) {
    const nowDate = dayjs().toDate().toDateString();

    return db
        .update(borrowRecords)
        .set({
            status: 'RETURNED',
            returnDate: nowDate
        })
        .where(eq(borrowRecords.id, borrowRecordId));
}

export { returnBorrowBook, borrowBookAddRecord };
