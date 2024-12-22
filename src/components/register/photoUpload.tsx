import { useState } from "react";

interface PhotoUploadProps {
  onImageChange: (image: string | null) => void;
}

export default function PhotoUpload({ onImageChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Base64 image:", base64String); // Verificar la imagen en base64
        setPreview(base64String);
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageChange(null);
    }
  };

  return (
    <div className="mb-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-full" />}
    </div>
  );
}
