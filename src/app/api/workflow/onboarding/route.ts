import db from '@/db';
import users from '@/db/schema/users';
import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';
import { eq } from 'drizzle-orm';

type UserState = 'non-active' | 'active';

interface InitialData {
    email: string;
    fullName: string;
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const ONE_MONTH_IN_MS = ONE_DAY_IN_MS * 30;

async function getUserState(email: string): Promise<UserState> {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        return 'non-active';
    }

    const lastActivityDate = new Date(user.lastActivityDate || user.createAt!);

    const now = new Date();
    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= ONE_MONTH_IN_MS) {
        return 'non-active';
    }

    return 'active';
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
                    subject: '我们又见面了',
                    message: `${fullName}，感谢你的信任！`
                });
            });
        }

        await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
    }
});
