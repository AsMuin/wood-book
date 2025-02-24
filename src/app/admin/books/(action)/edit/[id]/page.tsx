'use server';

import BookForm from '@/components/admin/BookForm';
import { selectBookById } from '@/db/utils/books';

export default async function EditBookPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const book = await selectBookById(id);

    return <BookForm type="UPDATE" {...book} />;
}
