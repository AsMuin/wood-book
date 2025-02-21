import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';

interface InitialData {
    email: string;
    fullName: string;
    bookName: string;
    day: number;
}

export const { POST } = serve<InitialData>(async context => {
    const { email, fullName, bookName, day } = context.requestPayload;

    await context.run('returnBook', async () => {
        await sendEmail({
            email,
            subject: '归还记录',
            message: `Hi ${fullName}, 你已归还《${bookName}》,借阅持续时间为${day}天 `
        });
    });
});
