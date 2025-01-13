import { IBook } from '../../types';

export default function BookOverview({
    id,
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl,
    videoUrl,
    summary
}: IBook) {
    return (
        <section className="book-overview">
            <div className="flex flex-1 flex-col gap-5">
                <h1>{title}</h1>
            </div>
        </section>
    );
}
