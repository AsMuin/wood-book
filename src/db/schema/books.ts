import { integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export default pgTable('books', {
    id: uuid('id').primaryKey().defaultRandom().notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    author: varchar('author', { length: 255 }).notNull(),
    genre: text('genre').notNull(),
    coverColor: varchar('cover_color', { length: 7 }).notNull(),
    coverUrl: text('cover_url').notNull(),
    rating: numeric('rating', { precision: 1 }).notNull(),
    description: text('description').notNull(),
    totalCopies: integer('total_copies').notNull().default(1),
    availableCopies: integer('available_copies').notNull().default(0),
    videoUrl: text('video_url').notNull(),
    summary: text('summary').notNull(),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow()
});
