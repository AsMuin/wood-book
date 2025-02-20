import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { dataBaseConfig } from '../../envConfig';
import * as schemaList from './schema';
import * as relationList from './relations';

const sql = neon(dataBaseConfig.url!);
const db = drizzle({
    client: sql,
    schema: {
        ...schemaList,
        ...relationList
    }
});

export default db;
