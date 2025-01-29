import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co'
            },
            {
                protocol: 'https',
                hostname: 'cloud.asmuin.top'
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com'
            }
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb'
        }
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default nextConfig;
