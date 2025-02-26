'use client';

import { userSchema } from '@/lib/validations';
import { FormItemConfig, IUser } from '../../../types';
import FlexForm from '@/components/FlexForm';
import { z } from 'zod';
import { toast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { editUser } from '@/lib/admin/actions/user';

type UserFormParams = z.infer<typeof userSchema>;

export default function UserForm({ ...user }: IUser) {
    const userFormConfig: FormItemConfig<UserFormParams>[] = [
        {
            key: 'name',
            label: '用户名',
            value: user.name || '',
            options: {
                placeholder: '请输入用户名'
            }
        },

        {
            key: 'email',
            label: '邮箱',
            value: user.email || '',
            options: {
                placeholder: '请输入邮箱'
            }
        },
        {
            key: 'image',
            label: '认证图片',
            value: user.image || '',
            type: 'image',
            options: {
                placeholder: '请上传封面'
            }
        }
    ];
    const router = useRouter();

    async function onSubmit(data: UserFormParams) {
        try {
            const res = await editUser(data);

            if (!res.success) {
                throw new Error(res.message);
            }

            toast({
                title: '成功',
                description: '更新成功'
            });
            router.push(`/admin/users`);
        } catch (error) {
            console.error(error);
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '更新失败',
                variant: 'destructive'
            });
        }
    }

    return (
        <FlexForm
            schema={userSchema}
            formConfig={userFormConfig}
            onSubmit={onSubmit}
            width="60vw"
            parentClass="grid grid-cols-2 gap-20 min-w-[672px]"
            formInputClass="book-form_input light"
            formItemClass="flex flex-col gap-1"
            formLabelClass="text-base font-normal text-dark-500"
        />
    );
}
