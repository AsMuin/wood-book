export interface IBook {
    id: number;
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
    isLoanedBook: boolean;
}

export interface IResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    // token?: string;
}

export interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    identImage: File;
}

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
