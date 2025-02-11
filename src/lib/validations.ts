import { z } from '@/lib/i18n';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, '密码长度不少于8位')
});

export const loginWithEmailSchema = z.object({
    email:z.string().email()
})

export const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8, '密码长度不少于8位'),
    identImage: z.string().nonempty('请上传图片')
});

export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(100),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(100),
    rating: z.coerce.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000),
    coverUrl: z.string().nonempty(),
    coverColor: z
        .string()
        .trim()
        .regex(/^#([0-9A-Fa-f]{6})$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10)
});
