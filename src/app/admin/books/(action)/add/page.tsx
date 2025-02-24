'use server';

import BookForm from '../../../../../components/admin/BookForm';

export default async function AddBookPage() {
    return <BookForm type="CREATE" />;
}
