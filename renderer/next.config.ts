import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El reporte de incidencias sube fotos/videos de hasta 25 MB vía Server
      // Action; el límite por defecto de 1 MB los rechaza. Holgura para el
      // overhead del FormData.
      bodySizeLimit: '30mb',
    },
  },
};

export default nextConfig;
