import { twMerge, twJoin, type ClassNameValue } from 'tailwind-merge';
import { IResponse } from '../../types';
import { toast } from '@/hooks/useToast';

export function cn(...inputs: ClassNameValue[]) {
    return twMerge(twJoin(inputs));
}

export async function uploadFileByUrl(file: File) {
    try {
        const getUrl = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type
            })
        });
        const getUrlRes: IResponse<{
            uploadUrl: string;
            publicUrl: string;
        }> = await getUrl.json();

        if (!getUrlRes.success) {
            throw new Error(getUrlRes.message);
        }

        const {
            data: { uploadUrl, publicUrl }
        } = getUrlRes;

        const upload = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        });

        if (upload.ok) {
            return publicUrl;
        } else {
            throw new Error('上传失败');
        }
    } catch (error) {
        console.error(error);
        toast({
            title: '失败',
            description: '上传失败',
            variant: 'destructive'
        });
    }
}

export function isServer() {
    if (typeof window == 'undefined') {
        console.log('server component');
    } else {
        console.log('client component');
    }
}

interface transformUrlParams {
    baseUrl: string;
    params: Record<string, string | number>;
}

export function transformGetParams({ baseUrl, params }: transformUrlParams) {
    const url = new URL(baseUrl, window.location.href);

    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.append(key, params[key] as string);
        }
    });

    return url;
}
