'use server';

import db from '@/db';
import { borrowBookParams } from '../../../types';
import responseBody from '../response';
import dayjs from 'dayjs';
import borrowRecords from '@/db/schema/borrowRecords';
import books from '@/db/schema/books';
import { eq } from 'drizzle-orm';

async function borrowBook({ bookId, userId }: borrowBookParams) {
    try {
        const book = await db.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, bookId)
        });

        if (!book || book.availableCopies <= 0) {
            throw new Error('无法借阅');
        }

        const dueDate = dayjs().add(7, 'day').toDate().toDateString();

        const newBorrowRecord = await db.insert(borrowRecords).values({
            userId,
            bookId,
            dueDate,
            status: 'BORROWED'
        });

        await db
            .update(books)
            .set({
                availableCopies: book.availableCopies - 1
            })
            .where(eq(books.id, bookId));

        return responseBody(true, '借阅成功');
    } catch (error) {
        console.error(error);

        return responseBody(false, error instanceof Error ? error.message : '借阅失败');
    }
}

export { borrowBook };
