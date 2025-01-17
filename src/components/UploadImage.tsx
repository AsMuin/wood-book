import Image from 'next/image';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function UploadImage({ onFileChange }: { onFileChange: (file: File | null) => void }) {
    const [fileInfo, setFileInfo] = useState({
        uploaded: false,
        url: '',
        name: ''
    });

    async function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const file = e.target.files[0];

        setFileInfo({
            uploaded: true,
            name: file.name,
            url: URL.createObjectURL(file)
        });

        onFileChange(file);
    }

    async function onReset() {
        setFileInfo({
            uploaded: false,
            url: '',
            name: ''
        });
        onFileChange(null);
    }

    useEffect(() => {
        return () => {
            if (fileInfo.uploaded) {
                URL.revokeObjectURL(fileInfo.url);
            }
        };
    }, [fileInfo]);

    return (
        <div>
            <div className={cn('rounded-md p-4', fileInfo.uploaded ? 'border-2 border-green-500 bg-green-100' : 'bg-slate-700')}>
                <div className="flex items-center justify-center"></div>
                <label className="upload-btn cursor-pointer">
                    <Input type="file" hidden onChange={selectFile} accept="image/*" />
                    {fileInfo.uploaded ? (
                        <>
                            <svg
                                className="mr-2 h-6 w-6 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium text-green-700">文件选择成功</span>
                        </>
                    ) : (
                        <>
                            <Image src="/icons/upload.svg" alt="upload" width={20} height={20} className="object-contain" />
                            <p className="text-base text-light-100">上传图片</p>
                        </>
                    )}
                </label>
            </div>
            {fileInfo.uploaded && (
                <div className="mx-auto mt-3 flex w-fit flex-wrap items-center gap-2">
                    <Image src={fileInfo.url} alt="upload" width={150} height={100} className="mx-auto grow rounded" />
                    <div className="mx-auto flex grow-0 lg:w-full justify-center">
                        <p className="text-base text-light-100">{fileInfo.name}</p>
                        <button
                            onClick={onReset}
                            className="ml-2 rounded-full bg-slate-600 p-1 text-white transition-colors hover:bg-red-600"
                            aria-label="Reset">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
