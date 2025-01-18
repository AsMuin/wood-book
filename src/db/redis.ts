import { Redis } from '@upstash/redis';
import { upstashConfig } from '../../envConfig';

const redis = new Redis({
    url: upstashConfig.redisUrl,
    token: upstashConfig.redisToken
});

export default redis;
