'use client';
import AuthForm, { FormItemConfig } from '@/components/AuthForm';
import { registerSchema } from '@/lib/validations';

export default function Registry() {
    const registerFormConfig: FormItemConfig[] = [
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
            key: 'universityId',
            label: '身份标识信息',
            placeholder: '请输入身份标识信息',
            options: {
                required: true
            }
        },
        {
            key: 'universityCard',
            label: '身份证号',
            type: 'image'
        }
    ];

    return (
        <div>
            <AuthForm type="REGISTER" schema={registerSchema} formConfig={registerFormConfig} onSubmit={() => {}} />
        </div>
    );
}
