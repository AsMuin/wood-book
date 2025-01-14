import { cn } from '@/lib/utils';
import Image from 'next/image';
import BookCoverSvg from './BookCoverSvg';

export interface IBookCoverProps {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: 'book-cover_extra_small',
    small: 'book-cover_small',
    medium: 'book-cover_medium',
    regular: 'book-cover_regular',
    wide: 'book-cover_wide'
};

export default function BookCover({
    className,
    variant = 'regular',
    coverColor = '#012B48',
    coverImage = 'https://placehold.co/400*600.png'
}: IBookCoverProps) {
    return (
        <div className={cn('relative transition-all duration-300 ease-in-out', variantStyles[variant], className)}>
            <BookCoverSvg coverColor={coverColor} />
            <div className="absolute z-10" style={{ left: '12%', width: '87.5%', height: '88%' }}>
                {
                    //TODO Delete unoptimized
                }
                <Image src={coverImage} alt="book cover" fill className="rounded-sm object-fill" unoptimized />
            </div>
        </div>
    );
}
