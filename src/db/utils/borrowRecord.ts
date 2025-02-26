import dayjs from 'dayjs';
import db from '..';
import { borrowRecords } from '../schema';
import { desc, eq } from 'drizzle-orm';

interface borrowBookParams {
    bookId: string;
    userId: string;
    day?: number;
}

// 添加借书记录
function borrowBookAddRecord({ bookId, userId, day = 7 }: borrowBookParams) {
    const dueDate = dayjs().add(day, 'day').toDate().toDateString();

    return db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
        status: 'BORROWED'
    });
}

// 还书时更新相应的借书记录
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

// 查询借书记录
function queryBorrowRecord(limit: number = 10, pageIndex: number = 0) {
    return db.query.borrowRecords.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(borrowRecords.createdAt)
    });
}

export { returnBorrowBook, borrowBookAddRecord, queryBorrowRecord };
