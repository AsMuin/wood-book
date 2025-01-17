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

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
