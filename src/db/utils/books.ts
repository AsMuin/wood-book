import { SQL, desc, eq, ilike } from 'drizzle-orm';
import db from '..';
import { books } from '../schema';
import { BookQueryParams } from '@types';
import { queryFilter } from '@/lib/utils';

//id查询书籍
function selectBookById(bookId: string) {
    return db.query.books.findFirst({
        where: (table, { eq }) => eq(table.id, bookId)
    });
}

//查询书籍是否归还了
async function getBorrowState(recordId: string): Promise<boolean> {
    const borrowRecord = await db.query.borrowRecords.findFirst({
        where: (table, { eq }) => eq(table.id, recordId)
    });

    if (!borrowRecord) {
        throw new Error('不存在该借阅记录');
    }

    return borrowRecord.status === 'RETURNED';
}

//分页查询书籍
function queryBook({ limit = 10, pageIndex = 0, ...filterParams }: { limit: number; pageIndex: number } & BookQueryParams) {
    const filterConfigMap = {
        title: (value: string) => ilike(books.title, value),
        author: (value: string) => ilike(books.author, value),
        genre: (value: string) => eq(books.genre, value)
    };

    const filters: SQL[] = queryFilter(filterConfigMap, filterParams);

    return db.query.books.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(books.createdAt),
        where: (table, { and }) => and(...filters)
    });
}

export { selectBookById, queryBook, getBorrowState };
