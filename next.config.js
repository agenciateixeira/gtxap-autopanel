/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para Docker/Cloud Run
  outputFileTracingRoot: require('path').join(__dirname, './'),
  // Se usar imagens externas, configure os domínios
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configurações para APIs externas se necessário
  async rewrites() {
    return [
      // Adicione rewrites se necessário
    ];
  },
}

module.exports = nextConfig