/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/synthesia-img-uploads/**',
        search: '',
      }
    ],
    loader: 'custom',
    path: '/',
  }
};

module.exports = nextConfig;
