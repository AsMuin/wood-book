import { bookSchema } from '@/lib/validations';
import { IBook } from '../../../../types';
import FlexForm, { FormItemConfig } from '@/components/FlexForm';

interface BookFormProps extends Partial<IBook> {
    type: 'CREATE' | 'UPDATE';
}

export default function BookForm({ type, ...book }: BookFormProps) {
    const bookFormConfig: FormItemConfig<IBook>[] = [];

    function onSubmit(data: IBook) {
        console.log(data);

        return Promise.resolve({ success: true, message: 'success' });
    }

    return (
        <div>
            <FlexForm schema={bookSchema} formConfig={bookFormConfig} onSubmit={onSubmit} />
        </div>
    );
}
