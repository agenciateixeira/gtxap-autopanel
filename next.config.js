/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configurações para APIs externas se necessário
  async rewrites() {
    return [
      // Adicione rewrites se necessário
    ];
  },
}

module.exports = nextConfig