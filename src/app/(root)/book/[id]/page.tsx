import BookOverview from '@/components/BookOverview';
import BookVideo from '@/components/BookVideo';
import db from '@/db';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/login');
    }

    const bookDetail = await db.query.books.findFirst({
        where: (books, { eq }) => eq(books.id, id)
    });

    console.log(bookDetail);

    if (!bookDetail) {
        redirect('/404');
    }

    return (
        <div>
            <BookOverview {...bookDetail} userId={userId!} />
            <div className="book-details">
                <section className="flex flex-col gap-7">
                    <h3>视频</h3>
                    <BookVideo videoUrl={bookDetail?.videoUrl} />
                </section>
                <section className="mt-10 flex flex-col gap-7">
                    <h3>摘要</h3>
                    <div className="space-y-5 text-xl text-light-100">
                        {bookDetail?.summary.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                    </div>
                </section>
            </div>
        </div>
    );
}
