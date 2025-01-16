'use client';
import AuthForm, { FormItemConfig } from '@/components/AuthForm';
import { loginSchema } from '@/lib/validations';

export default function SignIn() {
    const loginFormConfig: FormItemConfig[] = [
        {
            key: 'email',
            label: '邮箱',
            placeholder: '请输入邮箱',
            options: {
                required: true
            }
        },
        {
            key: 'password',
            label: '密码',
            placeholder: '请输入密码',
            options: {
                required: true
            }
        }
    ];

    return (
        <div>
            <AuthForm type="LOGIN" schema={loginSchema} formConfig={loginFormConfig} onSubmit={() => {}} />
        </div>
    );
}
