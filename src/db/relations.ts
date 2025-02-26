import { relations } from 'drizzle-orm';
import books from './schema/books';
import borrowRecords from './schema/borrowRecords';
import users from './schema/users';

// 用户表关系
const userRelation = relations(users, ({ many }) => ({
    borrowRecords: many(borrowRecords)
}));

//书籍表关系
const booksRelation = relations(books, ({ many }) => ({
    borrowRecords: many(borrowRecords)
}));
// 借书记录表关系
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
