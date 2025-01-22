'use client';
import { DefaultValues, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UploadImage from './UploadImage';
import { FormItemConfig, IResponse } from '../../types';
import { cn } from '@/lib/utils';

export interface FlexFormProps<T extends FieldValues> {
    schema: z.Schema<T>;
    formConfig: FormItemConfig<T>[];
    onSubmit: (data: T) => Promise<IResponse> | IResponse;
    parentClass?: string;
    formItemClass?: string;
    formLabelClass?: string;
    formInputClass?: string;
    button?: SubmitButtonProps;
}

export default function FlexForm<T extends FieldValues>({ schema, formConfig, button, onSubmit, ...formClass }: FlexFormProps<T>) {
    const defaultValues = {} as DefaultValues<T>;

    formConfig.forEach(item => {
        defaultValues[item.key as keyof DefaultValues<T>] = item.defaultValue;
    });
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn(formClass?.parentClass)}>
                {formConfig?.map(({ key, label, options, description, type, slot }) => (
                    <FormField
                        key={key as string}
                        control={form.control}
                        name={key as keyof T as Path<T>}
                        render={({ field }) => {
                            const renderFormItem = (Field: typeof field, Options: typeof options) => {
                                if (slot) {
                                    return slot(Field, Options);
                                } else {
                                    switch (type) {
                                        case 'image': {
                                            return <UploadImage {...Field} {...Options} onFileChange={field.onChange} />;
                                        }

                                        case 'textarea': {
                                            return <textarea {...Field} {...Options}></textarea>;
                                        }

                                        default: {
                                            return (
                                                <Input
                                                    type={type || 'text'}
                                                    {...Field}
                                                    {...Options}
                                                    className={cn(formClass?.formInputClass ? formClass?.formInputClass : 'form-input')}
                                                />
                                            );
                                        }
                                    }
                                }
                            };

                            return (
                                <FormItem className={cn(formClass?.formItemClass)}>
                                    <FormLabel className={cn(formClass?.formLabelClass ? formClass?.formLabelClass : 'capitalize')}>
                                        {label}
                                    </FormLabel>
                                    <FormControl>{renderFormItem(field, options)}</FormControl>
                                    <FormDescription>{description || ''}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                ))}
                <div className="text-center">
                    <FlexForm.SubmitButton {...button} />
                </div>
            </form>
        </Form>
    );
}

interface SubmitButtonProps {
    children?: React.ReactNode;
    disabled?: boolean;
    replace?: boolean;
}

FlexForm.SubmitButton = function FormSubmitButton({ children, disabled, replace }: SubmitButtonProps) {
    return (
        <>
            {replace ? (
                children
            ) : (
                <button type="submit" className="form-btn" disabled={disabled}>
                    {children || '确定'}
                </button>
            )}
        </>
    );
};
