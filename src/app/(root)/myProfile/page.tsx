import BookList from '@/components/BookList';
import db from '@/db';
import { auth, signOut } from '@/lib/auth';
import dayjs from 'dayjs';

export default async function MyProfilePage() {
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) {
        signOut();
    }

    const borrowedBooks = await db.query.borrowRecords.findMany({
        where: (table, { eq }) => eq(table.userId, userId),
        with: {
            book: true
        }
    });
    const nowDay = dayjs();
    const displayBookList = borrowedBooks.map(borrowedRecord => ({
        ...borrowedRecord.book,
        returnDueDay: borrowedRecord.status === 'BORROWED' ? dayjs(borrowedRecord.dueDate).diff(nowDay, 'day') : 0,
        borrowRecordId: borrowedRecord.id
    }));

    return (
        <div>
            <BookList title="我的书籍" books={displayBookList} userId={userId} />
        </div>
    );
}
