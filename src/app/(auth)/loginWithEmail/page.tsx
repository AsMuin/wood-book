'use client';
import { loginWithEmailSchema } from '@/lib/validations';
import { LoginWithEmail } from '@/lib/actions/auth';
import { AuthCredentials, FormItemConfig } from '../../../../types';
import AuthForm from '@/components/AuthForm';

export default function SignInWithEmail() {
    const loginWithEmailConfig: FormItemConfig<Pick<AuthCredentials, 'email'>>[] = [
        {
            key: 'email',
            label: '邮箱',
            type: 'email',
            options: {
                placeholder: '请输入邮箱'
            }
        }
    ];

    return (
        <div>
            <AuthForm type="LOGIN_EMAIL" schema={loginWithEmailSchema} formConfig={loginWithEmailConfig} onSubmit={LoginWithEmail} />
        </div>
    );
}
