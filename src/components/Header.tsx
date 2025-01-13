'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
export default function Header() {
    const pathname = usePathname();
    const navBarList = [
        {
            href: '/library',
            label: '图书馆'
        }
    ];
    return (
        <header className="my-10 flex justify-between gap-5">
            <Link href="/">
                <Image src="/icons/logo.svg" width={40} height={40} alt="logo" />
            </Link>
            <ul className="flex flex-row items-center gap-8">
                {navBarList.map(item => (
                    <li key={item.href} className="cursor-pointer text-base capitalize">
                        <Link
                            href={item.href}
                            className={cn('cursor-pointer text-base capitalize', pathname === item.href ? 'text-light-200' : 'text-light-100')}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </header>
    );
}
