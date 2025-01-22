'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BookForm from '../../forms/BookForm';

export default function AddBookPage() {
    return (
        <>
            <Button asChild className="back-btn">
                <Link href="/admin/books">返回</Link>
            </Button>
            <section className="w-full max-w-2xl">
                <p>Book Form</p>
                <BookForm type="CREATE" />
            </section>
        </>
    );
}
