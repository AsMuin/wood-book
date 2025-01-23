import { generatePresignedUrl } from '@/lib/cloudFlare';
import apiResponse from '@/lib/response';

export async function POST(request: Request) {
    try {
        const { fileName, fileType } = await request.json();

        const { presignedUrl, publicUrl } = await generatePresignedUrl(fileName, fileType);

        return apiResponse(true, 'Image uploadUrl returned', {
            data: {
                uploadUrl: presignedUrl,
                publicUrl
            }
        });
    } catch (e) {
        return apiResponse(false, e instanceof Error ? e.message : 'Image upload failed');
    }
}
