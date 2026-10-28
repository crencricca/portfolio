/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [{ source: '/resume', destination: '/', permanent: true }],
};

export default nextConfig;
