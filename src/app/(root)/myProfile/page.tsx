import { signOut } from '@/auth';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/button';
import { sampleBooks } from '@/constants';

export default function MyProfilePage() {
    return (
        <div>
            <form
                className="mb-10"
                action={async () => {
                    'use server';
                    await signOut();
                }}>
                <Button>登出</Button>
            </form>
            <BookList title="我的书籍" books={sampleBooks} />
        </div>
    );
}
