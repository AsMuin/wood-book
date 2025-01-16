import uploadFile from '@/lib/cloudFlare';
import apiResponse from '@/lib/response';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');

        if (!image || typeof image === 'string') {
            return apiResponse(false, 'Image is required and must be a file');
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageUrl = await uploadFile(imageBuffer, `${Date.now()}-${image.name}`);

        if (!imageUrl) {
            return apiResponse(false, 'Image upload failed');
        }

        return apiResponse(true, 'Image uploaded successfully', { data: imageUrl });
    } catch (e) {
        return apiResponse(false, e instanceof Error ? e.message : 'Image upload failed');
    }
}
