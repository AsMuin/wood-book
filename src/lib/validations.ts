import { z } from '@/lib/i18n';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    identImage: z.instanceof(File, {
        message: '身份认证图片是必须的'
    })
});

export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(100),
    author: z.string().trim().min(2).max(100),
    category: z.string().trim().min(2).max(100),
    rating: z.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000),
    coverUrl: z.string().nonempty(),
    coverColor: z
        .string()
        .trim()
        .regex(/^#([0-9A-Fa-f]{6})$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10)
});
