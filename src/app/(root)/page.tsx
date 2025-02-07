import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import db from '@/db';
import books from '@/db/schema/books';
import { auth } from '@/lib/auth';
import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

const getLatestBooks = unstable_cache(
    async () => {
      return await  db.query.books.findMany({
        limit: 10,
        orderBy: desc(books.createdAt)
    });
    },
    ['latestBooks'],
    { revalidate: 3600, tags: ['latestBooks'] }
  )

export default async function Home() {
    const session = await auth();

    const latestBooks = await getLatestBooks()

    return (
        <>
            <BookOverview {...latestBooks[0]} userId={session?.user?.id} />
            <BookList title="最受欢迎书籍" books={latestBooks.slice(1)} containerClassName="mt-28" />
        </>
    );
}
