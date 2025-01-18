import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import user from './schema/user';

const db = drizzle({
    connection: {
        connectionString: process.env.DATABASE_URL!
    },
    schema: {
        user
    }
});

export default db;
