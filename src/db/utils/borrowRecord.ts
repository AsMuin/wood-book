import dayjs from 'dayjs';
import db from '..';
import { books, borrowRecords, users } from '../schema';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { BorrowRecordQueryParams } from '@types';
import { queryFilter } from '@/lib/utils';

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
async function queryBorrowRecord({ limit = 10, pageIndex = 0, ...filterParams }: { limit: number; pageIndex: number } & BorrowRecordQueryParams) {
    const filterConfigMap = {
        userName: (value: string) => eq(users.name, value),
        bookName: (value: string) => eq(books.title, value),
        status: (value: 'BORROWED' | 'RETURNED') => eq(borrowRecords.status, value),
        startDate: (value: string) => gte(borrowRecords.createdAt, dayjs(value).toDate()),
        endDate: (value: string) => lte(borrowRecords.createdAt, dayjs(value).toDate())
    };
    const filter = queryFilter(filterConfigMap, filterParams);

    const data = await db
        .select({
            id: borrowRecords.id,
            userId: borrowRecords.userId,
            bookId: borrowRecords.bookId,
            dueDate: borrowRecords.dueDate,
            status: borrowRecords.status,
            startDate: borrowRecords.createdAt,
            returnDate: borrowRecords.returnDate,
            userName: users.name,
            bookName: books.title
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(and(...filter))
        .limit(limit)
        .offset(pageIndex * limit)
        .orderBy(desc(borrowRecords.createdAt));

    //TODO query API的联表查询（不太好用，尤其是嵌套结构想取部分数据平铺出来）
    // const data = await db.query.borrowRecords.findMany({
    //     with: {
    //         user: true,
    //         book: true
    //     },
    //     columns: {
    //         id: true,
    //         userId: true,
    //         bookId: true,
    //         dueDate: true,
    //         status: true,
    //         returnDate: true
    //     },
    //     where: and(
    //         filterParams.userName
    //             ? eq(borrowRecords.userId, db.select({ id: users.id }).from(users).where(eq(users.name, filterParams.userName)))
    //             : undefined
    //     ),
    //     limit,
    //     offset: pageIndex * limit,
    //     orderBy: desc(borrowRecords.createdAt)
    // });

    return data;
}

export { returnBorrowBook, borrowBookAddRecord, queryBorrowRecord };
