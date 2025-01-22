'use client';
import AuthForm from '@/components/AuthForm';
import { loginSchema } from '@/lib/validations';
import { LoginWithCredentials } from '@/lib/actions/auth';
import { AuthCredentials, FormItemConfig } from '../../../../types';

export default function SignIn() {
    const loginFormConfig: FormItemConfig<Pick<AuthCredentials, 'email' | 'password'>>[] = [
        {
            key: 'email',
            label: '邮箱',
            options: {
                placeholder: '请输入邮箱',
                required: true
            }
        },
        {
            key: 'password',
            label: '密码',
            type: 'password',
            options: {
                placeholder: '请输入密码',
                required: true
            }
        }
    ];

    return (
        <div>
            <AuthForm type="LOGIN" schema={loginSchema} formConfig={loginFormConfig} onSubmit={LoginWithCredentials} />
        </div>
    );
}
