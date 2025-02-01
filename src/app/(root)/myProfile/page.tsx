import BookList from '@/components/BookList';
import { sampleBooks } from '@/constants';

export default function MyProfilePage() {
    return (
        <div>
            <BookList title="我的书籍" books={sampleBooks} />
        </div>
    );
}
