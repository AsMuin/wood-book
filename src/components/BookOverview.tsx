import { IBook } from '../../types';
import Image from 'next/image';
import BookCover from './BookCover';
import db from '@/db';
import BorrowBook from './BorrowBook';
import { selectUserById } from '@/db/utils/users';

interface BookOverviewProps extends Omit<IBook, 'isLoanedBook'> {
    userId: string;
}

export default async function BookOverview({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl,
    userId,
    id: bookId
}: BookOverviewProps) {
    const user = await selectUserById(userId);

    if (!user) {
        return null;
    }

    const borrowInfo = {
        ableBorrow: availableCopies > 0 && user.status === 'APPROVED',
        message: availableCopies <= 0 ? '书籍不可借阅' : '你没有权限借阅'
    };

    return (
        <section className="book-overview">
            <div className="flex flex-1 flex-col gap-5">
                <h1>{title}</h1>
                <div className="book-info">
                    <p>
                        作者： <span className="font-semibold text-light-200">{author}</span>
                    </p>
                    <p>
                        类别：<span className="font-semibold text-light-200">{genre}</span>
                    </p>
                    <div className="flex gap-1">
                        <Image src="/icons/star.svg" style={{ width: 'auto', height: 'auto' }} width={22} height={22} alt="star" />
                        <p>{rating}</p>
                    </div>
                </div>
                <div className="book-copies">
                    <p>
                        总册数：<span className="font-semibold text-light-200">{totalCopies}</span>
                    </p>
                    <p>
                        剩余:<span className="font-semibold text-light-200">{availableCopies}</span>
                    </p>
                </div>
                <p className="book-description">{description}</p>
                {/* <Button className="book-overview_btn">
                    <Image src="/icons/book.svg" alt="book" width={20} height={20} />
                    <p className="font-bebas-neue text-xl text-dark-100">借阅</p>
                </Button> */}
                <BorrowBook borrowInfo={borrowInfo} userId={userId} bookId={bookId} />
            </div>
            <div className="relative flex flex-1 justify-center">
                <div className="relative">
                    <BookCover variant="wide" className="z-10" coverColor={coverColor} coverImage={coverUrl} />
                    <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
                        <BookCover variant="wide" coverColor={coverColor} coverImage={coverUrl} />
                    </div>
                </div>
            </div>
        </section>
    );
}
