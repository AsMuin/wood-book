'use server';
import db from '@/db';
import responseBody from '../response';
import { hash } from 'bcryptjs';
import users from '@/db/schema/users';
import { signIn, signOut as onSignOut } from '@/lib/auth';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';
import { workflowClient } from '../workflow';
import { nextProdUrl } from '../../../envConfig';
import { AuthCredentials } from '../../../types';
import { selectUserByEmail } from '@/db/utils/users';

async function Register(params: AuthCredentials) {
    const getHeaders = await headers();
    const ip = getHeaders.get('x-forwarded-for') || getHeaders.get('x-real-ip') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return redirect('/tooFast');
    }

    try {
        const { name, email, password, image } = params;

        const existingUser = await selectUserByEmail(email);

        if (existingUser) {
            throw new Error('用户已存在');
        }

        const hashedPassword = await hash(password, 10);

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            image
        });

        await workflowClient.trigger({
            url: `${nextProdUrl}/api/workflow/onboarding`,
            body: {
                email,
                fullName: name
            }
        });

        await LoginWithCredentials({ email, password });

        return responseBody(true, '注册成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '注册失败');
    }
}

async function LoginWithCredentials(credentials: Pick<AuthCredentials, 'email' | 'password'>) {
    const getHeaders = await headers();
    const ip = getHeaders.get('x-forwarded-for') || getHeaders.get('x-real-ip') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return redirect('/tooFast');
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

        return responseBody(true, '登录成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '登录失败');
    }
}

async function LoginWithEmail(credentials: Pick<AuthCredentials, 'email'>) {
    const getHeaders = await headers();
    const ip = getHeaders.get('x-forwarded-for') || getHeaders.get('x-real-ip') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return redirect('/tooFast');
    }

    try {
        const isExist = await selectUserByEmail(credentials.email)

        if (!isExist) {
            throw new Error('用户不存在');
        }

        return signIn('resend', credentials);
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '发送失败');
    }
}

async function signOut() {
    await onSignOut();
}

export { Register, LoginWithCredentials, signOut, LoginWithEmail };
