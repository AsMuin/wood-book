'use client';

import Image from 'next/image';
import { adminSideBarLinks } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from 'next-auth';

interface SidebarProps {
    session: Session;
}

export default function Sidebar({ session }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="admin-sidebar">
            <div className="logo">
                <Image src="/icons/admin/logo.svg" style={{ width: 'auto', height: 'auto' }} alt="logo" height={37} width={37} />
                <h1>WoodBook</h1>
            </div>
            <div className="mt-10 flex flex-col gap-5">
                {adminSideBarLinks.map(link => (
                    <Link href={link.route} key={link.route}>
                        <div className={cn('link', pathname === link.route && 'bg-primary-admin shadow-sm')}>
                            <div className="relative size-5">
                                <Image
                                    src={link.img}
                                    alt="icon"
                                    fill
                                    className={cn(pathname === link.route && 'brightness-0 invert', 'object-contain')}
                                />
                            </div>
                            <p className={cn(pathname === link.route ? 'text-white' : 'text-dark-400')}> {link.text}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="user">
                <Avatar>
                    <AvatarImage src={session.user?.image as string | undefined} />
                    <AvatarFallback className="bg-amber-100">{session.user?.name?.slice(0, 2).toUpperCase() || '用户'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col max-md:hidden">
                    <p className="font-semibold text-dark-200">{session.user?.name}</p>
                    <p className="text-xs text-light-500">{session.user?.email}</p>
                </div>
            </div>
        </div>
    );
}
