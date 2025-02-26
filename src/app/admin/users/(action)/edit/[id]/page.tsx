'use server';

import UserForm from '@/components/admin/UserForm';
import { selectUserById } from '@/db/utils/users';

export default async function EditBookPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const user = await selectUserById(id);

    if (!user) {
        throw new Error('用户不存在');
    }

    return <UserForm {...user} />;
}
