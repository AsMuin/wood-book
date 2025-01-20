import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import '@/styles/admin.css';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    return (
        <main className="flex min-h-screen w-full flex-row">
            <Sidebar session={session} />
            <div className="admin-container">
                <Header session={session} />
                {children}
            </div>
        </main>
    );
}
