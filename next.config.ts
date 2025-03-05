import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['obd-raw-data-parser'],
    output: 'standalone',
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    typescript: {
        ignoreBuildErrors: false
    },
    eslint: {
        ignoreDuringBuilds: true // Disable ESLint during production build
    },
    poweredByHeader: false,
    headers: async () => [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'Access-Control-Allow-Credentials',
                    value: 'true'
                },
                {
                    key: 'Access-Control-Allow-Origin',
                    value: '*'
                },
                {
                    key: 'Access-Control-Allow-Methods',
                    value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
                },
                {
                    key: 'Access-Control-Allow-Headers',
                    value: '*'
                }
            ]
        }
    ]
};

export default nextConfig;
