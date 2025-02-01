import { date, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import books from './books';
import users from './users';

export const BORROW_STATUS_ENUM = pgEnum('BORROW_STATUS', ['BORROWED', 'RETURNED']);

export default pgTable('borrow_records', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id')
        .references(() => users.id)
        .notNull(),
    bookId: uuid('book_id')
        .references(() => books.id)
        .notNull(),
    borrowDate: timestamp('borrow_date', { withTimezone: true }).defaultNow().notNull(),
    dueDate: date('due_date').notNull(),
    returnDate: date('return_date'),
    status: BORROW_STATUS_ENUM('status').default('BORROWED').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});
