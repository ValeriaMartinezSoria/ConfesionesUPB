const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export type CloudinaryUploadResponse = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  url?: string;
  [key: string]: any;
};

type UploadOptions = {
  fileName?: string;
  mimeType?: string;
};

export const uploadToCloudinary = async (
  uri: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary no está configurado. Define EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME y EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const fileName = options.fileName ?? "image.jpg";
  const mimeType = options.mimeType ?? "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as any);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al subir a Cloudinary: ${errorText}`);
  }

  return response.json();
};
