import Link from 'next/link';
import { IBook } from '../../types';
import BookCover from './BookCover';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { returnBook } from '@/lib/actions/book';

export interface IBookCardProps extends IBook {
    returnDueDay?: number;
    userId?: string;
    borrowRecordId?: string;
}

export default function BookCard({ id, title, genre, coverColor, coverUrl, returnDueDay = 0, userId, borrowRecordId }: IBookCardProps) {
    const day = Math.abs(returnDueDay);
    return (
        <li className={cn(returnDueDay && 'w-full xs:w-52')}>
            <Link href={`/book/${id}`} className={cn(returnDueDay && 'flex w-full flex-col items-center')}>
                <BookCover coverColor={coverColor} coverImage={coverUrl} />
                <div className={cn('mt-4', !returnDueDay && 'max-w-28 xs:max-w-40')}>
                    <p className="book-title text-center">{title}</p>
                    <p className="book-genre">{genre}</p>
                </div>
                {returnDueDay && (
                    <div className="mt-3 w-full">
                        <div className="book-loaned justify-center gap-1">
                            <Image src="/icons/calendar.svg" alt="calendar" width={18} height={18} className="object-contain" />
                            {returnDueDay > 0 ? <p className="text-light-100">{day}天后归还</p> : <p className="text-light-100">已逾期{day}天</p>}
                        </div>
                        <Button
                            className="book-btn bg-dark-600 hover:bg-dark-100"
                            formAction={() => {
                                returnBook({ userId: userId as string, recordId: borrowRecordId as string });
                            }}>
                            还书
                        </Button>
                        {/* <Button className="book-btn bg-dark-600 hover:bg-dark-100">下载收据</Button> */}
                    </div>
                )}
            </Link>
        </li>
    );
}
