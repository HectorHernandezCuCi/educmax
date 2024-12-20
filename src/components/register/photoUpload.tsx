import Image from "next/image";
import { useState } from "react";
import cameraIcon from "@/img/cameraIcon.svg";

import default1 from "@/img/book.png";
import default2 from "@/img/diploma.png";
import default3 from "@/img/dragon.png";
import default4 from "@/img/worm.png";
import default5 from "@/img/reading.png";

const defaultImages = [default1, default2, default3, default4, default5];

const PhotoUpload = ({
  onImageChange,
}: {
  onImageChange?: (image: string) => void;
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string; // Formato base64
      setProfileImage(base64Image);
      if (onImageChange) {
        onImageChange(base64Image); // Notifica al componente padre
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDefaultImageClick = (image: string) => {
    setProfileImage(image);
    if (onImageChange) {
      onImageChange(image);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-5">
      {/* Contenedor de la foto de perfil */}
      <label className="relative flex items-center justify-center border border-gray-500 rounded-full w-24 h-24 overflow-hidden opacity-75 hover:opacity-100 hover:border-blue-500 cursor-pointer transition-opacity duration-300">
        {profileImage ? (
          // Comprobar si profileImage es una cadena y si comienza con "data:image" (base64)
          typeof profileImage === "string" &&
          profileImage.startsWith("data:image") ? (
            <img
              src={profileImage}
              alt="Profile Image"
              className="w-full h-full object-cover"
            />
          ) : (
            // Si es una imagen predeterminada, usar <Image> de Next.js
            <Image
              src={profileImage}
              alt="Profile Image"
              className="w-full h-full object-cover"
              width={96}
              height={96}
            />
          )
        ) : (
          // Si no hay imagen, mostrar ícono de cámara
          <Image src={cameraIcon} alt="Camera Icon" width={40} height={40} />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* Imágenes predeterminadas */}
      <div className="flex gap-4">
        {defaultImages.map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full border-2 cursor-pointer ${
              profileImage === image ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => handleDefaultImageClick(image)}
          >
            <Image
              src={image}
              alt={`Default Image ${index + 1}`}
              className="w-full h-full object-cover rounded-full"
              width={64}
              height={64}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;
