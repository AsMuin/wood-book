import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { queryBook } from '@/db/utils/books';
import { auth } from '@/lib/auth';

export default async function Home() {
    const session = await auth();
    const userId = session?.user?.id;
    const latestBooks = await queryBook(10, 0);

    return (
        <>
            <BookOverview {...latestBooks[0]} userId={userId as string} />
            <BookList userId={userId as string} title="最受欢迎书籍" books={latestBooks.slice(1)} containerClassName="mt-28" />
        </>
    );
}
