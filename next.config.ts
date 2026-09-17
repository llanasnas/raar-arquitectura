import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las franjas de la apertura son ventanas estrechas y muy altas: `object-fit: cover`
    // escala la foto por la altura, así que piden ~1600 px de ancho aunque solo se vean 240.
    // Sin este ancho en la lista, el navegador saltaba de 1200 a 1920 y o se veía pixelado
    // o pesaba el doble de lo necesario.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 3840],
  },
};

export default nextConfig;
