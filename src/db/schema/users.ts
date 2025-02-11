import { text, pgTable, uuid, varchar, pgEnum, date, timestamp } from 'drizzle-orm/pg-core';

export const STATUS_ENUM = pgEnum('status', ['PENDING', 'APPROVED', 'REJECTED']);
export const ROLE_ENUM = pgEnum('role', ['USER', 'ADMIN']);

export default pgTable('users', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    image: text('image').notNull(),
    status: STATUS_ENUM('status').default('PENDING'),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    role: ROLE_ENUM('role').default('USER'),
    lastActivityDate: date('last_activity_date').defaultNow(),
    createAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow()
});
