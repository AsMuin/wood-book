import type { ReactNode } from 'react';
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

export interface IBorrowRecord {
    id: string;
    userName: string;
    bookName: string;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: 'BORROWED' | 'RETURNED';
    startDate: Date;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
    emailVerified: Date | null;
    role: 'USER' | 'ADMIN' | null;
    lastActivityDate: string | null;
    createAt: Date | null;
}

export interface IResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    total?: number;
    pageIndex?: number;
    limit?: number;
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

export interface BookQueryParams {
    title?: string;
    author?: string;
    genre?: string;
}

export interface UserQueryParams {
    role?: 'USER' | 'ADMIN';
}

export interface BorrowRecordQueryParams {
    bookName?: string;
    userName?: string;
    status?: 'BORROWED' | 'RETURNED';
    startDate?: string;
    endDate?: string;
}

export interface TableRef extends null {
    query: () => Promise<void>;
}

export type QueryParams<P = unknown> = {
    pageIndex: number;
    limit: number;
    signal?: AbortSignal;
} & P;

export type TableColumns<T extends Record<string, any>> = {
    [key in keyof Partial<T>]: {
        header: ReactNode;
        render?: (value: T[key], rowData: T) => ReactNode;
    };
};

export interface SearchFilterItem<P> {
    label: ReactNode;
    defaultValue?: P[key];
    placeholder?: string;
    render?: (value: P[key], allParams: P, onChange: (value: P[key]) => void) => ReactNode;
}

export interface SearchColumnItem<P> extends SearchFilterItem<P> {
    key: keyof P;
}

export type SearchColumns<P> = {
    [key in keyof P]: SearchFilterItem<P>;
};

export type ModelMap = 'User' | 'Book' | 'BorrowRecord';
