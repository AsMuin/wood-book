'use client';
import { ControllerRenderProps, DefaultValues, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UploadImage from './UploadImage';
import { IResponse } from '../../types';

export interface FormItemConfig<T extends FieldValues = FieldValues> {
    key: keyof T;
    label: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'image';
    placeholder?: string;
    defaultValue?: any;
    description?: string;
    options?: Partial<
        ControllerRenderProps<T> & {
            required?: boolean;
        }
    >;
}

export interface FlexFormProps<T extends FieldValues> {
    schema: z.Schema<T>;
    formConfig: FormItemConfig<T>[];
    onSubmit: (data: T) => Promise<IResponse> | IResponse;
    button?: SubmitButtonProps;
}

export default function FlexForm<T extends FieldValues>({ schema, formConfig, button, onSubmit }: FlexFormProps<T>) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {formConfig?.map(({ key, label, placeholder, options, description, type }) => (
                    <FormField
                        key={key as string}
                        control={form.control}
                        name={key as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="capitalize">{label}</FormLabel>
                                <FormControl>
                                    {type === 'image' ? (
                                        <UploadImage {...field} {...options} onFileChange={field.onChange} />
                                    ) : (
                                        <Input type={type || 'text'} placeholder={placeholder || ''} {...field} {...options} className="form-input" />
                                    )}
                                </FormControl>
                                <FormDescription>{description || ''}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
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
