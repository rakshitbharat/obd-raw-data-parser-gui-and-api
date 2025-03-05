import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ['obd-raw-data-parser'],
    // Disable powered by header
    poweredByHeader: false,
    // Disable all security headers
    headers: async () => [],
    // Allow all cross-origin requests
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: '*' }
                ]
            }
        ];
    }
};

export default nextConfig;
