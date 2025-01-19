import { Client } from '@upstash/workflow';
import { upstashConfig } from '../../envConfig';

export const workflowClient = new Client({
    baseUrl: upstashConfig.qstash.url,
    token: upstashConfig.qstash.token!
});
