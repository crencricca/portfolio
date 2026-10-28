/** @type {import('next').NextConfig} */
const nextConfig = {
  // The resume used to live at /resume before it became the landing page
  async redirects() {
    return [{ source: '/resume', destination: '/', permanent: true }];
  },
};

export default nextConfig;
