'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BookForm from '../../../../components/admin/BookForm';

export default function AddBookPage() {
    return (
        <>
            <Button asChild className="back-btn rounded-sm">
                <Link href="/admin/books">返回</Link>
            </Button>
            <section className="w-full max-w-2xl">
                <BookForm type="CREATE" />
            </section>
        </>
    );
}
