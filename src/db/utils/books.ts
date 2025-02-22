import { desc } from 'drizzle-orm';
import db from '..';
import { books } from '../schema';

function selectBookById(bookId: string) {
    return db.query.books.findFirst({
        where: (table, { eq }) => eq(table.id, bookId)
    });
}

function queryBook(limit: number = 10, pageIndex: number = 0) {
    return db.query.books.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(books.createdAt)
    });
}

export { selectBookById, queryBook };
