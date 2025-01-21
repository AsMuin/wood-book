'use client';
import AuthForm from '@/components/AuthForm';
import { registerSchema } from '@/lib/validations';
import { AuthCredentials, FormItemConfig } from '../../../../types';
import { Register } from '@/lib/actions/auth';

export default function Registry() {
    const registerFormConfig: FormItemConfig<AuthCredentials>[] = [
        {
            key: 'fullName',
            label: '姓名',
            placeholder: '请输入姓名',
            options: {
                required: true
            }
        },
        {
            key: 'email',
            label: '邮箱',
            type: 'email',
            placeholder: '请输入邮箱',
            options: {
                required: true
            }
        },
        {
            key: 'password',
            label: '密码',
            type: 'password',
            placeholder: '请输入密码',
            options: {
                required: true
            }
        },
        {
            key: 'identImage',
            label: '身份证号',
            type: 'image'
        }
    ];

    return (
        <div>
            <AuthForm type="REGISTER" schema={registerSchema} formConfig={registerFormConfig} onSubmit={Register} />
        </div>
    );
}
