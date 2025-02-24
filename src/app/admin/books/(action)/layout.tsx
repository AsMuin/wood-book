import { Button } from '@/components/ui/button';
import Link from 'next/link';

function EditLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Button asChild className="back-btn rounded-sm">
                <Link href="/admin/books">返回</Link>
            </Button>
            <section className="w-full max-w-2xl">{children}</section>
        </>
    );
}

export default EditLayout;
