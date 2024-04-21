/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Google image domains (for Google Sign-In profile image)
      'lh3.googleusercontent.com',
      // Product image domain (for BigBasket product images used in the app)
      'www.bigbasket.com',
      // Image server domain (for images uploaded into the app)
      'utfs.io'
    ],
  },
  // Here we are disabling eslint validation during build,
  // because it is not required and it will save some time during build.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
