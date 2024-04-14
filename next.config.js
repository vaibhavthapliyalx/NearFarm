/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'www.bigbasket.com'
    ],
  },
  // Here we are disabling eslint validation during build,
  // because it is not required and it will save some time during build.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
