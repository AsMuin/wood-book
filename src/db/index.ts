import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { dataBaseConfig } from '../../envConfig';
import * as schemaList from './schema';
import * as relationList from './relations';

// 连接数据库
const sql = neon(dataBaseConfig.url!);
// 数据库配置(提供TS类型支持)
const db = drizzle({
    client: sql,
    schema: {
        ...schemaList,
        ...relationList
    },
    logger: true
});

export default db;
