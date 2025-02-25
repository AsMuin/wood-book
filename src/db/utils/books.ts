import { desc } from 'drizzle-orm';
import db from '..';
import { books } from '../schema';

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
function queryBook(limit: number = 10, pageIndex: number = 0) {
    return db.query.books.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(books.createdAt)
    });
}

export { selectBookById, queryBook, getBorrowState };
