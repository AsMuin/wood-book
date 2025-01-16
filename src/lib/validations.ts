import { z } from '@/lib/i18n';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    universityId: z.string().nonempty('身份标识信息是必须的'),
    universityCard: z.instanceof(File, {
        message: '身份认证图片是必须的'
    })
});
