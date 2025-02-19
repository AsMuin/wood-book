import { getBorrowState } from '@/lib/actions/utils';
import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';

interface InitialData {
    email: string;
    fullName: string;
    day: number;
    bookName: string;
    recordId: string;
}

export const { POST } = serve<InitialData>(async context => {
    const { email, fullName, day, bookName, recordId } = context.requestPayload;

    await context.run('borrowBook', async () => {
        await sendEmail({
            email,
            subject: '你的借阅信息',
            message: `Hi ${fullName}, 你已成功借阅《${bookName}》,借阅时长为${day}天 `
        });
    });

    await context.sleep('wait-for-returnDate', 60 * 60 * 24 * day - 1);

    const hasReturn = await context.run('check-borrow-state', async () => {
        return await getBorrowState(recordId);
    });

    if (!hasReturn) {
        await context.run('send-email-tipReturn', async () => {
            await sendEmail({
                email,
                subject: '还书提醒',
                message: `${fullName}，《${bookName}》是否让你感受到阅读的魅力呢？，在鉴赏之余不要忘记明天就是归还日哦。`
            });
        });

        await context.sleep('wait-for-checkReturn', 60 * 60 * 24);
        const hasReturn = await context.run('check-borrow-state', async () => {
            return await getBorrowState(recordId);
        });

        if (!hasReturn) {
            await context.run('send-email-lateTime', async () => {
                await sendEmail({
                    email,
                    subject: '还书逾期提醒',
                    message: `${fullName}，你最近可能太忙了忘记让《${bookName}》回家了，让小家伙赶紧回家吧。`
                });
            });
        }
    }
});
