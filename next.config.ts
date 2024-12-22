import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Recomendado para identificar problemas potenciales
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"], // Agrega el dominio de Cloudinary y el dominio de placeholder
  },
};

export default nextConfig;
