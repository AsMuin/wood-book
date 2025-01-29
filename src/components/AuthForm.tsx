'use client';

import { FieldValues } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { FormItemConfig, IResponse } from '../../types';
import { toast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import FlexForm from './FlexForm';

export interface AuthFormProps<T extends FieldValues> {
    type: 'LOGIN' | 'REGISTER';
    schema: z.Schema<T>;
    formConfig: FormItemConfig<T>[];
    onSubmit: (data: T) => Promise<IResponse> | IResponse;
}

export default function AuthForm<T extends FieldValues>({ type, schema, formConfig, onSubmit }: AuthFormProps<T>) {
    const isLogin = type === 'LOGIN';
    const router = useRouter();

    async function handleSubmit(data: T) {
        try {
            const result = await onSubmit(data);

            if (result.success) {
                toast({
                    title: '成功',
                    description: result.message
                });
                router.push('/');

                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: '失败',
                description: type === 'LOGIN' ? '登录失败' : '注册失败',
                variant: 'destructive'
            });

            return Promise.reject(error);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">{isLogin ? '欢迎回来' : '注册属于你的账号'}</h1>
            <p className="text-light-100">{isLogin ? '登录你的账号以访问图书信息' : '请填写下述注册信息并提供有效的身份验证信息'}</p>
            <FlexForm
                formInputClass="dark"
                schema={schema}
                formConfig={formConfig}
                onSubmit={handleSubmit}
                button={{ children: isLogin ? '登录' : '注册' }}
                parentClass="space-y-6"
            />
            <p className="text-center text-base font-medium">
                {isLogin ? '创建新账号?' : '已有账号?'}
                <Link className="font-bold text-primary" href={isLogin ? '/register' : '/login'}>
                    {isLogin ? '注册' : '登录'}
                </Link>
            </p>
        </div>
    );
}
