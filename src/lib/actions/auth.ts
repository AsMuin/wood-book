'use server';

import db from '@/db';
import { AuthCredentials } from '../../../types';
import apiResponse from '../response';
import { hash } from 'bcryptjs';
import user from '@/db/schema/user';
import uploadFile from '../cloudFlare';
import { signIn } from '@/auth';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';

async function Register(params: AuthCredentials) {
    try {
        const ip = (await headers()).get('x-forwarded-for') || (await headers()).get('x-real-ip') || '127.0.0.1';
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return redirect('/tooFast');
        }

        const { fullName, email, password, identImage } = params;

        const existingUser = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, email)
        });

        if (existingUser) {
            throw new Error('用户已存在');
        }

        const identImageBuffer = await identImage.arrayBuffer();
        const hashedPassword = hash(password, 10);
        const uploadImage = uploadFile(Buffer.from(identImageBuffer), `${Date.now()}-${identImage.name}`);
        const asyncLoad = await Promise.all([uploadImage, hashedPassword]);

        if (!asyncLoad[0]) {
            throw new Error('图片上传失败');
        }

        await db.insert(user).values({
            fullName,
            email,
            password: asyncLoad[1],
            identImage: asyncLoad[0]
        });

        await LoginWithCredentials({ email, password });

        return apiResponse(true, '注册成功');
    } catch (error) {
        return apiResponse(false, error instanceof Error ? error.message : '注册失败');
    }
}

async function LoginWithCredentials(credentials: Pick<AuthCredentials, 'email' | 'password'>) {
    try {
        const ip = (await headers()).get('x-forwarded-for') || (await headers()).get('x-real-ip') || '127.0.0.1';
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return redirect('/tooFast');
        }

        const { email, password } = credentials;
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        return apiResponse(true, '登录成功');
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            return redirect('/tooFast');
        } else {
            return apiResponse(false, error instanceof Error ? error.message : '登录失败');
        }
    }
}

export { Register, LoginWithCredentials };
