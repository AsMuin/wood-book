import { IBook } from '../../types';
import BookCard from './BookCard';

export interface BookListProps {
    title: string;
    books: IBook[];
    containerClassName?: string;
    userId: string;
}

export default function BookList({ title, books, containerClassName, userId }: BookListProps) {
    if (books.length < 1) return null;

    return (
        <section className={containerClassName}>
            <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
            <ul className="book-list">
                {books.map((book, index) => (
                    <BookCard key={index} {...book} userId={userId} />
                ))}
            </ul>
        </section>
    );
}
