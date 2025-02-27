'use server';

import db from '@/db';
import books from '@/db/schema/books';
import responseBody from '@/lib/response';
import { BookQueryParams, IBook } from '@types';
import { selectUserById } from '@/db/utils/users';
import { queryBook } from '@/db/utils/books';
import { eq } from 'drizzle-orm';

type CreateBookParams = Omit<IBook, 'id' | 'availableCopies' | 'createdAt'>;

//添加书籍
async function createBook(bookParams: CreateBookParams) {
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

type UpdateBookParams = Omit<IBook, 'createdAt' | 'borrowRecordId' | 'returnDueDay' | 'availableCopies'>;

//编辑书籍
async function editBook({ id, ...bookParams }: UpdateBookParams) {
    try {
        const book = await db.query.books.findFirst({
            where: table => eq(table.id, id)
        });

        if (!book) {
            throw new Error('书籍不存在');
        }

        await db
            .update(books)
            .set({
                ...bookParams
            })
            .where(eq(books.id, id));

        return responseBody(true, '修改成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '修改失败');
    }
}

//表格查询书籍
async function tableQueryBook({ limit, pageIndex, ...filterParams }: { limit: number; pageIndex: number } & BookQueryParams) {
    try {
        const [data, total] = await Promise.all([queryBook({ limit, pageIndex, ...filterParams }), db.$count(books)]);

        return responseBody(true, '查询成功', {
            data,
            pageIndex,
            limit,
            total
        });
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '查询失败');
    }
}

//删除书籍
async function deleteBook(id: string, userId: string) {
    try {
        const user = await selectUserById(userId);

        if (user?.role !== 'ADMIN') {
            throw new Error('你无权进行该操作');
        }

        await db.delete(books).where(eq(books.id, id));

        return responseBody(true, '删除成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '删除失败');
    }
}

export { createBook, tableQueryBook, deleteBook, editBook };
