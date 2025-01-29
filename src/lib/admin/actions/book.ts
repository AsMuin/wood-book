'use server';

import responseBody from '@/lib/response';
import { IBook } from '../../../../types';
import db from '@/db';
import books from '@/db/schema/books';

async function createBook(bookParams: Omit<IBook, 'id' | 'isLoanedBook' | 'availableCopies'>) {
    try {
        const newBook = await db
            .insert(books)
            .values({
                ...bookParams,
                availableCopies: bookParams.totalCopies
            })
            .returning();

        return responseBody(true, '添加成功', {
            data: newBook[0]
        });
    } catch (error) {
        console.error(error);

        return responseBody(false, error instanceof Error ? error.message : '创建失败');
    }
}

export { createBook };
