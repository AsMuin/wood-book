'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/useToast';
import { useState } from 'react';
import { borrowBook } from '@/lib/actions/book';

interface BorrowBookProps {
    borrowInfo: {
        ableBorrow: boolean;
        message: string;
    };
    userId: string;
    bookId: string;
}

export default function BorrowBook({ userId, bookId, borrowInfo }: BorrowBookProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onBorrow() {
        setIsLoading(true);

        try {
            if (!borrowInfo.ableBorrow) {
                throw new Error(borrowInfo.message);
            }

            const res = await borrowBook({ bookId, userId, day:7 });

            if (!res.success) {
                throw new Error(res.message);
            } else {
                toast({
                    title: '成功',
                    description: '借阅成功'
                });
                router.push('/myProfile');
            }
        } catch (error) {
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '借阅失败',
                variant: 'destructive'
            });
        }

        setIsLoading(false);
    }

    return (
        <>
            <Button className="book-overview_btn" disabled={!borrowInfo.ableBorrow || isLoading} onClick={onBorrow}>
                <Image src="/icons/book.svg" alt="book" width={20} height={20} />
                <p className="font-bebas-neue text-xl text-dark-100">借阅</p>
            </Button>
        </>
    );
}
