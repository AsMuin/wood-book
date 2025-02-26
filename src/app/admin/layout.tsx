import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { selectUserById } from '@/db/utils/users';
import { SessionProvider } from 'next-auth/react';
import '@/styles/admin.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const user = await selectUserById(session?.user?.id);

    const isAdmin = user?.role === 'ADMIN';

    if (!isAdmin) {
        redirect('/');
    }

    return (
        <SessionProvider session={session}>
            <main className="flex min-h-screen w-full flex-row">
                <Sidebar session={session} />
                <div className="admin-container">
                    <Header session={session} />
                    {children}
                </div>
            </main>
        </SessionProvider>
    );
}
