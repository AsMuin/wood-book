import { Session } from 'next-auth';

export default function Header({ session }: { session: Session }) {
    return (
        <div className="admin-header">
            <div>
                <h2 className="text-2xl font-semibold text-dark-400">{session.user?.name}</h2>
                <p className="text-base text-slate-500">管理你的所有书籍和用户</p>
            </div>
        </div>
    );
}
