export const checkCloudinaryCloudName = () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        console.warn("Cloudinary Cloud Name is missing");
        return null;
    }
    return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
};

export const uploadImage = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) return null;

    // 1. Get Signature
    const timestamp = Math.round((new Date).getTime() / 1000);
    const paramsToSign = {
        timestamp: timestamp,
    };

    try {
        const signRes = await fetch('/api/cloudinary/sign', {
            method: 'POST',
            body: JSON.stringify({ paramsToSign })
        });
        const { signature } = await signRes.json();

        if (!signature) throw new Error("Failed to get signature");

        // 2. Upload with Signature
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        return data.secure_url;
    } catch (e) {
        console.error("Upload failed", e);
        return null;
    }
}
