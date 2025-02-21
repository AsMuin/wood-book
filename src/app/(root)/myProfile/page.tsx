import BookList from '@/components/BookList';
import db from '@/db';
import { auth, signOut } from '@/lib/auth';
import dayjs from 'dayjs';
import { IBook } from '../../../../types';

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

    const displayBookList = borrowedBooks.reduce((list, record) => {
        if (record.status === 'RETURNED') {
            return list;
        } else {
            const returnDueDay = dayjs(record.dueDate).diff(nowDay, 'day');

            const displayBook = {
                ...record.book,
                returnDueDay: returnDueDay,
                borrowRecordId: record.id
            };
            
            return list.concat(displayBook);
        }
    }, [] as IBook[]);

    return (
        <div>
            <BookList title="我的书籍" books={displayBookList} userId={userId} />
        </div>
    );
}
