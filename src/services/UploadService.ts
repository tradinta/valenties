
import axios from 'axios';

interface UploadSignature {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
}

export const UploadService = {
    async uploadFile(file: File | Blob, type: 'image' | 'voice', onProgress?: (percent: number) => void): Promise<string> {
        try {
            // 1. Prepare Params to Sign
            const timestamp = Math.round(new Date().getTime() / 1000);
            const paramsToSign = {
                timestamp: timestamp,
                folder: 'chaos_connect/uploads'
            };

            // 2. Get Signature (Securely)
            const { getAuth } = await import('firebase/auth');
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();

            const signatureRes = await axios.post('/api/cloudinary/sign',
                { paramsToSign },
                { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
            );

            const { signature, apiKey, cloudName } = signatureRes.data;

            // 3. Prepare Form Data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'chaos_connect/uploads');

            const resourceType = 'auto';
            const cloudNameTarget = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

            if (!cloudNameTarget) throw new Error("Cloud Name not found");

            // 4. Upload
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudNameTarget}/${resourceType}/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress?.(percent);
                        }
                    }
                }
            );

            return response.data.secure_url;
        } catch (error: any) {
            console.error('Upload failed:', error);
            throw new Error(error.response?.data?.error?.message || 'Upload failed');
        }
    }
};
