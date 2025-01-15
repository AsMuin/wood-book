'use client';
import AuthForm, { FormItemConfig } from '@/components/AuthForm';
import { registerSchema } from '@/lib/validations';

export default function Registry() {
    const registerFormConfig: FormItemConfig[] = [
        {
            key: 'fullName',
            label: '姓名',
            placeholder: '请输入姓名'
        },
        {
            key: 'email',
            label: '邮箱',
            placeholder: '请输入邮箱'
        },
        {
            key: 'password',
            label: '密码',
            placeholder: '请输入密码'
        },
        {
            key: 'universityId',
            label: '身份标识信息',
            placeholder: '请输入身份标识信息'
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
