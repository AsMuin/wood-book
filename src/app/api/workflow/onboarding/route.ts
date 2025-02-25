import { getUserState } from '@/db/utils/users';
import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';

interface InitialData {
    email: string;
    fullName: string;
}

export const { POST } = serve<InitialData>(async context => {
    const { email, fullName } = context.requestPayload;

    await context.run('new-signup', async () => {
        await sendEmail({
            email,
            subject: 'Welcome to WoodBook',
            message: `Hi ${fullName}, 欢迎你来到WoodBook!`
        });
    });

    await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3);

    while (true) {
        const state = await context.run('check-user-state', async () => {
            return await getUserState(email);
        });

        if (state === 'non-active') {
            await context.run('send-email-non-active', async () => {
                await sendEmail({
                    email,
                    subject: '好久不见',
                    message: `${fullName}，有些时间没见你了，欢迎回来！`
                });
            });
        } else if (state === 'active') {
            await context.run('send-email-active', async () => {
                await sendEmail({
                    email,
                    subject: '这些天我们又见面了',
                    message: `${fullName}，感谢你的信任！`
                });
            });
        }

        await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
    }
});
