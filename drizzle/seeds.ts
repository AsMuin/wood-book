import { sampleBooks } from '@/constants';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import books from '@/db/schema/books';

config({ path: '.env.local' });

const dev_DataBase = process.env.DATABASE_NENO_DEV_URL;
const prod_DataBase = process.env.DATABASE_NENO_URL;

const sql = neon(prod_DataBase!);
const db = drizzle(sql);

async function seed() {
    try {
        for (const book of sampleBooks) {
            const addBook = {
                ...book,
                availableCopies: book.totalCopies,
                id: undefined,
                createdAt: undefined
            };

            await db
                .insert(books)
                .values({
                    ...addBook,
                    availableCopies: addBook.totalCopies
                })
                .returning();
        }
    } catch (error) {
        console.error(error);
    }
}

seed();
