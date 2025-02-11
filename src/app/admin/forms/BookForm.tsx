import { bookSchema } from '@/lib/validations';
import { FormItemConfig, IBook } from '../../../../types';
import FlexForm from '@/components/FlexForm';
import { z } from 'zod';
import ColorPicker from '@/components/admin/ColorPicker';
import { createBook } from '@/lib/admin/actions/book';
import { toast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

interface BookFormProps extends Partial<IBook> {
    type: 'CREATE' | 'UPDATE';
}
type bookFormParams = z.infer<typeof bookSchema>;

export default function BookForm({ type, ...book }: BookFormProps) {
    const bookFormConfig: FormItemConfig<bookFormParams>[] = [
        {
            key: 'title',
            label: '书名',
            value: book.title || '',
            options: {
                placeholder: '请输入书名'
            }
        },

        {
            key: 'author',
            label: '作者',
            value: book.author || '',
            options: {
                placeholder: '请输入作者'
            }
        },
        {
            key: 'genre',
            label: '分类',
            value: book.genre || '',
            options: {
                placeholder: '请输入分类'
            }
        },
        {
            key: 'rating',
            label: '评分',
            type: 'number',
            value: book.rating || 1,
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
            value: book.totalCopies || 0,
            options: {
                placeholder: '请输入总册数',
                min: 0,
                step: 1
            }
        },
        {
            key: 'coverColor',
            label: '封面颜色',
            value: book.coverColor || '',
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
            value: book.coverUrl || '',
            options: {
                placeholder: '请上传封面'
            }
        },
        {
            key: 'videoUrl',
            label: '视频',
            type: 'file',
            value: book.videoUrl || '',
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
    const router = useRouter();

    async function onSubmit(data: bookFormParams) {
        try {
            const res = await createBook(data);

            if (!res.success) {
                throw new Error(res.message);
            }

            toast({
                title: '成功',
                description: '添加成功'
            });
            router.push(`/admin/books/${res.data?.id}`);
        } catch (error) {
            console.error(error);
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '添加失败',
                variant: 'destructive'
            });
        }
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
