"use client"

import { returnBook } from '@/lib/actions/book';
import { Button } from './ui/button';
import { toast } from '@/hooks/useToast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReturnBookProps {
    recordId: string;
    userId: string;
}
export default function ReturnBook({ recordId, userId }: ReturnBookProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function handleReturn() {
        setIsLoading(true);
        try {
            const result = await returnBook({ recordId, userId });
            if (!result.success) {
                throw new Error(result.message);
            }
            toast({
                title: '成功',
                description: '还书成功'
            });
            router.refresh()
        } catch (error) {
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '还书失败',
                variant: 'destructive'
            });
        }
        setIsLoading(false);
    }
    return (
        <Button className="book-btn bg-dark-600 hover:bg-dark-100" onClick={handleReturn} disabled={isLoading}>
            还书
        </Button>
    );
}
