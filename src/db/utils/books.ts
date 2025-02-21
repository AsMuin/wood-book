import { desc } from 'drizzle-orm';
import db from '..';
import { books } from '../schema';

function selectBookById(bookId: string) {
    return db.query.books.findFirst({
        where: (table, { eq }) => eq(table.id, bookId)
    });
}
function selectLatestBooks(limit: number = 10) {
    return db.query.books.findMany({
        limit,
        orderBy: desc(books.createdAt)
    });
}

export { selectLatestBooks, selectBookById };
