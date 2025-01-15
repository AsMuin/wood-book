'use client';

import { ControllerRenderProps, DefaultValues, FieldValues, Path, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export interface FormItemConfig<T extends FieldValues = FieldValues> {
    key: keyof T;
    label: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'image';
    placeholder?: string;
    defaultValue?: any;
    description?: string;
    options?: ControllerRenderProps<T>;
}

export interface AuthFormProps<T extends FieldValues> {
    type: 'LOGIN' | 'REGISTER';
    schema: z.Schema<T>;
    formConfig: FormItemConfig<T>[];
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

export default function AuthForm<T extends FieldValues>({ type, schema, formConfig, onSubmit }: AuthFormProps<T>) {
    const isLogin = type === 'LOGIN';
    const defaultValues = {} as DefaultValues<T>;
    formConfig.forEach(item => {
        defaultValues[item.key as keyof DefaultValues<T>] = item.defaultValue;
    });
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues
    });

    const handleSubmit: SubmitHandler<T> = async data => {
        console.log(data);
    };
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">{isLogin ? '欢迎回来' : '注册属于你的账号'}</h1>
            <p className="text-light-100">{isLogin ? '登录你的账号以访问图书信息' : '请填写下述注册信息并提供有效的身份验证信息'}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {formConfig?.map(({ key, label, placeholder, options, description }) => (
                        <FormField
                            key={key as string}
                            control={form.control}
                            name={key as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">{label}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={placeholder || ''} {...field} {...options} />
                                    </FormControl>
                                    <FormDescription>{description || ''}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <div className="text-center">
                        <Button type="submit" className="text-slate-700">
                            {isLogin ? '登录' : '注册'}
                        </Button>
                    </div>
                </form>
            </Form>
            <p className="text-center text-base font-medium">
                {isLogin ? '创建新账号?' : '已有账号?'}
                <Link className="font-bold text-primary" href={isLogin ? '/register' : '/login'}>
                    {isLogin ? '注册' : '登录'}
                </Link>
            </p>
        </div>
    );
}
