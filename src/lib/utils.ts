import { twMerge, twJoin, type ClassNameValue } from 'tailwind-merge';

export function cn(...inputs: ClassNameValue[]) {
    return twMerge(twJoin(inputs));
}
