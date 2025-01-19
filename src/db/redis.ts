import { Redis } from '@upstash/redis';
import { upstashConfig } from '../../envConfig';

const redis = new Redis({
    url: upstashConfig.redis.url,
    token: upstashConfig.redis.token
});

export default redis;
