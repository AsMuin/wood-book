import { Client as WorkflowClient } from '@upstash/workflow';
import { Client as QstashClient, resend } from '@upstash/qstash';
import { upstashConfig, resendConfig } from '../../envConfig';

const workflowClient = new WorkflowClient({
    baseUrl: upstashConfig.qstash.url,
    token: upstashConfig.qstash.token!
});

const qstashClient = new QstashClient({
    token: upstashConfig.qstash.token!
});

export interface SendEmailProps {
    email: string;
    subject: string;
    message: string;
}

async function sendEmail({ email, subject, message }: SendEmailProps) {
    await qstashClient.publishJSON({
        api: {
            name: 'email',
            provider: resend({ token: resendConfig.token! })
        },
        body: {
            from: 'AsMuin <email@woodBook.com>',
            to: [email],
            subject,
            html: `<p>${message}</p>`
        }
    });
}

export { workflowClient, sendEmail };
