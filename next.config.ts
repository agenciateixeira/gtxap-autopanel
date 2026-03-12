/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suprime o aviso de hidratação para atributos de extensões do navegador
  experimental: {
    suppressHydrationWarning: true
  }
}

module.exports = nextConfig