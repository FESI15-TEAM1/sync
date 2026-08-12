import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // svgr turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Youtube thumbnail images
      },
      {
        protocol: 'https',
        hostname: 'code-it-sync-bucket.s3.ap-northeast-2.amazonaws.com', // S3 bucket for SYNC images
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net', // Kakao profile images
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
      },
    ],
  },
};

export default nextConfig;
