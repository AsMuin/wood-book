import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import users from './schema/users';
import { dataBaseConfig } from '../../envConfig';
import books from './schema/books';

const sql = neon(dataBaseConfig.url!);
const db = drizzle({
    client: sql,
    schema: {
        users,
        books
    }
});

export default db;
