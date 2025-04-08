import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
  basePath: process.env.NODE_ENV === 'production' ? '/resume' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resume/' : '',
};

export default nextConfig;
