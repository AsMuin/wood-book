import Link from 'next/link';
import { IBook } from '../../types';
import BookCover from './BookCover';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
export interface IBookCardProps extends IBook {
    isLoanedBook: boolean;
}

export default function BookCard({ id, title, genre, coverColor, coverUrl, isLoanedBook = false }: IBookCardProps) {
    return (
        <li className={cn(isLoanedBook && 'w-full xs:w-52')}>
            <Link href={`/book/${id}`} className={cn(isLoanedBook && 'flex w-full flex-col items-center')}>
                <BookCover coverColor={coverColor} coverImage={coverUrl} />
                <div className={cn('mt-4', !isLoanedBook && 'max-w-28 xs:max-w-40')}>
                    <p className="book-title">{title}</p>
                    <p className="book-genre">{genre}</p>
                </div>
                {isLoanedBook && (
                    <div className="mt-3 w-full">
                        <div className="book-loaned">
                            <Image src="/icons/calendar.svg" alt="calendar" width={18} height={18} className="object-contain" />
                            <p className="text-light-100">11天后归还</p>
                        </div>
                        <Button className="book-btn bg-dark-600 hover:bg-dark-100">下载收据</Button>
                    </div>
                )}
            </Link>
        </li>
    );
}
