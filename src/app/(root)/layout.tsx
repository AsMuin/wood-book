import { auth } from '@/lib/auth';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import users from '@/db/schema/users';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { SessionProvider } from 'next-auth/react';
import { selectUserById } from '@/db/utils/users';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    after(async () => {
        if (!session?.user?.id) {
            return;
        }

        const user = await selectUserById(session?.user?.id)

        const dateStamp = new Date().toISOString().slice(0, 10);

        if (user?.lastActivityDate !== dateStamp) {
            await db
                .update(users)
                .set({
                    lastActivityDate: dateStamp
                })
                .where(eq(users.id, session?.user?.id));
        }
    });

    return (
        <SessionProvider session={session}>
            <main className="root-container">
                <div className="mx-auto max-w-7xl">
                    <Header session={session} />
                    <div className="mt-20 pb-20">
                      {children}
                    </div>
                </div>
            </main>
        </SessionProvider>
    );
}
