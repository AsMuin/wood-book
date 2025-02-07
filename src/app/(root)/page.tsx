import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import db from '@/db';
import books from '@/db/schema/books';
import { auth } from '@/lib/auth';
import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';


export default async function Home() {
    const session = await auth();

    const latestBooks = await db.query.books.findMany({
      limit: 10,
      orderBy: desc(books.createdAt)
  });

    return (
        <>
            <BookOverview {...latestBooks[0]} userId={session?.user?.id} />
            <BookList title="最受欢迎书籍" books={latestBooks.slice(1)} containerClassName="mt-28" />
        </>
    );
}
