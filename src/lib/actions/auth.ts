'use server';

import db from '@/db';
import { AuthCredentials } from '../../../types';
import apiResponse from '../response';
import { hash } from 'bcryptjs';
import users from '@/db/schema/users';
import uploadFile from '../cloudFlare';
import { signIn } from '@/lib/auth';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';
import { workflowClient } from '../workflow';
import { nextProdUrl } from '../../../envConfig';

async function Register(params: AuthCredentials) {
    const getHeaders = await headers();
    const ip = getHeaders.get('x-forwarded-for') || getHeaders.get('x-real-ip') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        redirect('/tooFast');
    }

    try {
        const { fullName, email, password, identImage } = params;

        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
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

        await db.insert(users).values({
            fullName,
            email,
            password: asyncLoad[1],
            identImage: asyncLoad[0]
        });

        await workflowClient.trigger({
            url: `${nextProdUrl}/api/workflow/onboarding`,
            body: {
                email,
                fullName
            }
        });

        await LoginWithCredentials({ email, password });

        return apiResponse(true, '注册成功');
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            redirect('/tooFast');
        }

        return apiResponse(false, error instanceof Error ? error.message : '注册失败');
    }
}

async function LoginWithCredentials(credentials: Pick<AuthCredentials, 'email' | 'password'>) {
    const getHeaders = await headers();
    const ip = getHeaders.get('x-forwarded-for') || getHeaders.get('x-real-ip') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        redirect('/tooFast');
    }

    try {
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
        return apiResponse(false, error instanceof Error ? error.message : '登录失败');
    }
}

export { Register, LoginWithCredentials };
