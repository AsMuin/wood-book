'use server';

import db from '@/db';
import { borrowBookParams, returnBookParams } from '../../../types';
import responseBody from '../response';
import dayjs from 'dayjs';
import borrowRecords from '@/db/schema/borrowRecords';
import books from '@/db/schema/books';
import { eq } from 'drizzle-orm';
import { workflowClient } from '../workflow';
import { nextProdUrl } from '../../../envConfig';

async function borrowBook({ bookId, userId, day = 7 }: borrowBookParams) {
    try {
        const bookPromise = db.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, bookId)
        });

        const userPromise = db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        });
        const [book, user] = await Promise.all([bookPromise, userPromise]);

        if (!user) {
            throw new Error('用户不存在');
        }

        if (!book || book.availableCopies <= 0) {
            throw new Error('无法借阅');
        }

        const dueDate = dayjs().add(day, 'day').toDate().toDateString();

        const addRecord = await db
            .insert(borrowRecords)
            .values({
                userId,
                bookId,
                dueDate,
                status: 'BORROWED'
            })
            .returning({ id: borrowRecords.id });

        await db
            .update(books)
            .set({
                availableCopies: book.availableCopies - 1
            })
            .where(eq(books.id, bookId));

        await workflowClient.trigger({
            url: `${nextProdUrl}/api/workflow/onBorrow`,
            body: {
                email: user?.email,
                fullName: user?.name,
                day,
                bookName: book.title,
                recordId: addRecord[0].id
            }
        });

        return responseBody(true, '借阅成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '借阅失败');
    }
}

async function returnBook({ recordId, userId }: returnBookParams) {
    try {
        const selectedRecord = await db.query.borrowRecords.findFirst({
            where: (table, { eq }) => eq(table.id, recordId),
            with: {
                user: {
                    columns: {
                        id: true,
                        role: true
                    }
                },
                book: {
                    columns: {
                        id: true,
                        availableCopies: true
                    }
                }
            }
        });
        const operator = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        });

        const isAdmin = operator?.role === 'ADMIN';

        if (selectedRecord?.user.id !== userId && !isAdmin) {
            throw new Error('你不是借阅人无权操作');
        }

        if (!selectedRecord) {
            throw new Error('不存在该借阅记录');
        }

        if (selectedRecord?.status === 'RETURNED') {
            throw new Error('该书已归还');
        }

        const nowDate = dayjs().toDate().toDateString();

        await db
            .update(borrowRecords)
            .set({
                status: 'RETURNED',
                returnDate: nowDate
            })
            .where(eq(borrowRecords.id, recordId));

        await db
            .update(books)
            .set({
                availableCopies: selectedRecord.book.availableCopies + 1
            })
            .where(eq(books.id, selectedRecord.book.id));

        return responseBody(true, '还书成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '还书失败');
    }
}

export { borrowBook, returnBook };
