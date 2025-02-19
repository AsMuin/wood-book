import { relations } from 'drizzle-orm';
import books from './schema/books';
import borrowRecords from './schema/borrowRecords';
import users from './schema/users';

const userRelation = relations(users, ({ many }) => ({
    borrowRecords: many(borrowRecords)
}));

const booksRelation = relations(books, ({ many }) => ({
    borrowRecords: many(borrowRecords)
}));

const borrowRelation = relations(borrowRecords, ({ one }) => ({
    book: one(books, {
        fields: [borrowRecords.bookId],
        references: [books.id]
    }),
    user: one(users, {
        fields: [borrowRecords.userId],
        references: [users.id]
    })
}));

export { userRelation, booksRelation, borrowRelation };
