'use server';

import db from '@/db';
import { borrowBookParams, returnBookParams } from '../../../types';
import responseBody from '../response';
import borrowRecords from '@/db/schema/borrowRecords';
import books from '@/db/schema/books';
import { eq } from 'drizzle-orm';
import { workflowClient } from '../workflow';
import { nextProdUrl } from '../../../envConfig';
import { selectUserById } from '@/db/utils/users';
import { selectBookById } from '@/db/utils/books';
import { returnBorrowBook, borrowBookAddRecord } from '@/db/utils/borrowRecord';
import dayjs from 'dayjs';

// 借书
async function borrowBook({ bookId, userId, day = 7 }: borrowBookParams) {
    try {
        const bookPromise = selectBookById(bookId);

        const userPromise = selectUserById(userId);
        const [book, user] = await Promise.all([bookPromise, userPromise]);

        if (!user) {
            throw new Error('用户不存在');
        }

        if (!book || book.availableCopies <= 0) {
            throw new Error('无法借阅');
        }

        const addRecord = await borrowBookAddRecord({ bookId, userId, day }).returning({
            id: borrowRecords.id
        });

        await db
            .update(books)
            .set({
                availableCopies: book.availableCopies - 1
            })
            .where(eq(books.id, bookId));

        workflowClient.trigger({
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

//还书
async function returnBook({ recordId, userId }: returnBookParams) {
    try {
        const selectedRecord = await db.query.borrowRecords.findFirst({
            where: (table, { eq }) => eq(table.id, recordId),
            with: {
                user: {
                    columns: {
                        id: true,
                        role: true,
                        email: true,
                        name: true
                    }
                },
                book: {
                    columns: {
                        id: true,
                        availableCopies: true,
                        title: true
                    }
                }
            }
        });
        const operator = await selectUserById(userId);
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

        await returnBorrowBook(recordId);

        await db
            .update(books)
            .set({
                availableCopies: selectedRecord.book.availableCopies + 1
            })
            .where(eq(books.id, selectedRecord.book.id));
        const dueDay = dayjs().diff(selectedRecord.createdAt, 'day');

        workflowClient.trigger({
            url: `${nextProdUrl}/api/workflow/onReturn`,
            body: {
                email: selectedRecord.user.email,
                fullName: selectedRecord.user.name,
                bookName: selectedRecord.book.title,
                recordId: selectedRecord.id,
                day: dueDay
            }
        });

        return responseBody(true, '还书成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '还书失败');
    }
}

export { borrowBook, returnBook };
