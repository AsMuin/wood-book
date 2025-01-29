import { bookSchema } from '@/lib/validations';
import { FormItemConfig, IBook } from '../../../../types';
import FlexForm from '@/components/FlexForm';
import { z } from 'zod';
import ColorPicker from '@/components/admin/ColorPicker';

interface BookFormProps extends Partial<IBook> {
    type: 'CREATE' | 'UPDATE';
}
type bookFormParams = z.infer<typeof bookSchema>;

export default function BookForm({ type, ...book }: BookFormProps) {
    const bookFormConfig: FormItemConfig<bookFormParams>[] = [
        {
            key: 'title',
            label: '书名',
            defaultValue: book.title || '',
            options: {
                placeholder: '请输入书名'
            }
        },

        {
            key: 'author',
            label: '作者',
            defaultValue: book.author || '',
            options: {
                placeholder: '请输入作者'
            }
        },
        {
            key: 'genre',
            label: '分类',
            defaultValue: book.genre || '',
            options: {
                placeholder: '请输入分类'
            }
        },
        {
            key: 'rating',
            label: '评分',
            type: 'number',
            defaultValue: book.rating || 1,
            options: {
                step: 0.1,
                min: 1,
                max: 5,
                placeholder: '请输入评分'
            }
        },
        {
            key: 'totalCopies',
            label: '总册数',
            type: 'number',
            defaultValue: book.totalCopies || 0,
            options: {
                placeholder: '请输入总册数',
                min: 0,
                step: 1
            }
        },
        {
            key: 'coverColor',
            label: '封面颜色',
            defaultValue: book.coverColor || '',
            options: {
                placeholder: '请输入封面颜色'
            },
            slot: field => {
                return <ColorPicker value={field.value} onPickChange={field.onChange} />;
            }
        },
        {
            key: 'coverUrl',
            label: '封面',
            type: 'image',
            defaultValue: book.coverUrl || '',
            options: {
                placeholder: '请上传封面'
            }
        },
        {
            key: 'videoUrl',
            label: '视频',
            type: 'file',
            defaultValue: book.videoUrl || '',
            options: {
                placeholder: '请上传视频'
            }
        },
        {
            key: 'description',
            label: '描述',
            type: 'textarea',
            options: {
                placeholder: '请输入描述'
            }
        },
        {
            key: 'summary',
            label: '摘要',
            type: 'textarea',
            options: {
                placeholder: '请输入摘要'
            }
        }
    ];

    function onSubmit(data: bookFormParams) {
        console.log(data);

        return Promise.resolve({ success: true, message: 'success' });
    }

    return (
        <div>
            <FlexForm
                schema={bookSchema}
                formConfig={bookFormConfig}
                onSubmit={onSubmit}
                parentClass="flex flex-col gap-2"
                formInputClass="book-form_input light"
                formItemClass="flex flex-col gap-1"
                formLabelClass="text-base font-normal text-dark-500"
            />
        </div>
    );
}
