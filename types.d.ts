import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { registerSchema } from '@/lib/validations';

export interface IBook {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
    totalCopies: number;
    availableCopies: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    videoUrl: string;
    summary: string;
    createdAt: Date | null;
    borrowRecordId?: string;
    returnDueDay?: number;
}

export interface IResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export type AuthCredentials = z.infer<typeof registerSchema>;

type formItemConfigOptions<T> = Partial<
    ControllerRenderProps<T> & {
        placeholder?: string;
        step: number;
        min: number;
        max: number;
    }
>;
export interface FormItemConfig<T extends FieldValues = FieldValues> {
    key: keyof T;
    label: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'image';
    value?: any;
    description?: string;
    slot?: (filed: ControllerRenderProps<T, Path<T>>, options?: formItemConfigOptions<T>) => React.ReactNode;
    options?: formItemConfigOptions<T>;
}

export interface borrowBookParams {
    bookId: string;
    userId: string;
    day: number;
}

export interface returnBookParams {
    recordId: string;
    userId: string;
}
