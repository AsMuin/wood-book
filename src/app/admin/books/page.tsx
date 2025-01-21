import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BooksPage() {
    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">所有书籍</h2>
                <Button className="bg-primary-admin" asChild>
                    <Link href="/admin/books/add" className="text-white">
                        添加一个新的书籍
                    </Link>
                </Button>
            </div>
            <div className="mt-7 w-full overflow-hidden">
                <p>Table</p>
            </div>
        </section>
    );
}
